package com.xadazhii.server.controllers;

import com.xadazhii.server.models.*;
import com.xadazhii.server.payload.request.TestRequest;
import com.xadazhii.server.payload.request.TestResultRequest;
import com.xadazhii.server.payload.response.TestSummaryResponse;
import com.xadazhii.server.repository.*;
import com.xadazhii.server.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "https://btsss-stu-fei.netlify.app", maxAge = 3600)
@RestController
@RequestMapping("/api/tests")
public class TestController {

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TestResultRepository testResultRepository;

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public List<TestSummaryResponse> getAllTests() {
        List<Test> tests = testRepository.findAll();
        return tests.stream().map(test -> {
            int questionCount = test.getQuestions().size();
            int totalPoints = test.getQuestions().stream()
                    .mapToInt(Question::getPoints)
                    .sum();
            return new TestSummaryResponse(test.getId(), test.getTitle(), questionCount, totalPoints);
        }).collect(Collectors.toList());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> createTest(@RequestBody TestRequest testRequest) {
        if (testRequest.getTitle() == null || testRequest.getTitle().isEmpty()) {
            return ResponseEntity.badRequest().body("Title is required.");
        }
        Test newTest = new Test();
        newTest.setTitle(testRequest.getTitle());

        List<Question> questionEntities = new ArrayList<>();
        if (testRequest.getQuestions() != null) {
            for (TestRequest.QuestionDTO qdto : testRequest.getQuestions()) {
                Question question = getQuestion(qdto, newTest);
                questionEntities.add(question);
            }
        }
        newTest.setQuestions(questionEntities);
        Test savedTest = testRepository.save(newTest);
        return createTestDetailResponse(savedTest);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTest(@PathVariable Long id) {
        if (!testRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        testRepository.deleteById(id);
        return ResponseEntity.ok("Test deleted successfully!");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> updateTest(@PathVariable Long id, @RequestBody TestRequest testRequest) {
        Test test = testRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Test not found with id: " + id));

        boolean hasResults = testResultRepository.existsByTestId(id);
        if (hasResults) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Tento test nemôže byť upravený, pretože už má výsledky od študentov.");
        }

        test.setTitle(testRequest.getTitle());
        List<Question> questionEntities = new ArrayList<>();
        if (testRequest.getQuestions() != null) {
            for (TestRequest.QuestionDTO qdto : testRequest.getQuestions()) {
                Question question = getQuestion(qdto, test);
                questionEntities.add(question);
            }
        }
        test.setQuestions(questionEntities);
        Test updatedTest = testRepository.save(test);
        return createTestDetailResponse(updatedTest);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getTest(@PathVariable Long id) {
        Test test = testRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Test not found with id: " + id));
        return createTestDetailResponse(test);
    }

    @GetMapping("/completed")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public ResponseEntity<Set<Long>> getCompletedTestIds() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long studentId = userDetails.getId();
        Set<Long> completedTestIds = testResultRepository.findByStudentId(studentId).stream()
                .map(testResult -> testResult.getTest().getId())
                .collect(Collectors.toSet());
        return ResponseEntity.ok(completedTestIds);
    }

    @PostMapping("/results")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> saveTestResult(@RequestBody TestResultRequest request) {
        User student = userRepository.findById(request.getStudentId())
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        Test test = testRepository.findById(request.getTestId())
                .orElseThrow(() -> new NoSuchElementException("Test not found"));

        TestResult result = new TestResult();
        result.setStudent(student);
        result.setTest(test);

        int totalPoints = 0;

        if (request.getSubmissions() != null) {
            for (TestResultRequest.AnswerSubmission submission : request.getSubmissions()) {
                Question question = questionRepository.findById(submission.getQuestionId())
                        .orElseThrow(NoSuchElementException::new);

                StudentAnswer studentAnswer = new StudentAnswer();
                studentAnswer.setTestResult(result);
                studentAnswer.setQuestion(question);

                if ("CLOSED".equalsIgnoreCase(question.getType())) {
                    Answer selectedAnswer = answerRepository.findById(submission.getAnswerId())
                            .orElseThrow(NoSuchElementException::new);

                    totalPoints += selectedAnswer.getPointsWeight();
                    studentAnswer.setSelectedAnswer(selectedAnswer);
                    studentAnswer.setCorrect(selectedAnswer.getPointsWeight() > 0);

                } else if ("OPEN".equalsIgnoreCase(question.getType())) {
                    String studentText = submission.getTextResponse();
                    studentAnswer.setTextResponse(studentText);

                    boolean isMatchFound = false;

                    if (studentText != null && !studentText.trim().isEmpty()) {
                        String normalizedStudentText = studentText.replaceAll("\\s+", "").toLowerCase().replace(",", ".");

                        for (Answer acceptedVariant : question.getAnswers()) {
                            String normalizedAccepted = acceptedVariant.getAnswerText()
                                    .replaceAll("\\s+", "").toLowerCase().replace(",", ".");

                            if (normalizedStudentText.contains(normalizedAccepted)) {
                                totalPoints += acceptedVariant.getPointsWeight();
                                studentAnswer.setCorrect(acceptedVariant.getPointsWeight() > 0);
                                isMatchFound = true;
                                break;
                            }
                        }
                    }

                    if (!isMatchFound) {
                        studentAnswer.setCorrect(false);
                    }
                }

                result.getSubmittedAnswers().add(studentAnswer);
            }
        }

        result.setScore(Math.max(totalPoints, 0));
        TestResult savedResult = testResultRepository.save(result);

        Map<String, Object> response = new HashMap<>();
        response.put("testResultId", savedResult.getId());
        response.put("score", savedResult.getScore());

        return ResponseEntity.ok(response);
    }

    private Question getQuestion(TestRequest.QuestionDTO qdto, Test test) {
        Question question = new Question();
        question.setQuestionText(qdto.getQuestion());
        question.setPoints(qdto.getPoints());
        question.setType(qdto.getType() != null ? qdto.getType() : "CLOSED");
        question.setTest(test);

        List<Answer> answerEntities = new ArrayList<>();
        if (qdto.getAnswers() != null) {
            for (TestRequest.AnswerDTO adto : qdto.getAnswers()) {
                Answer answer = new Answer();
                answer.setAnswerText(adto.getText());
                answer.setPointsWeight(adto.getPointsWeight());
                answer.setQuestion(question);
                answerEntities.add(answer);
            }
        }
        question.setAnswers(answerEntities);
        return question;
    }

    private Map<String, Object> getStringObjectMap(Question q) {
        Map<String, Object> qDto = new HashMap<>();
        qDto.put("questionId", q.getId());
        qDto.put("question", q.getQuestionText());
        qDto.put("type", q.getType());
        qDto.put("points", q.getPoints());

        List<Map<String, Object>> answersDto = new ArrayList<>();
        for (Answer answer : q.getAnswers()) {
            Map<String, Object> ansDto = new HashMap<>();
            ansDto.put("answerId", answer.getId());
            ansDto.put("text", answer.getAnswerText());
            ansDto.put("pointsWeight", answer.getPointsWeight());
            answersDto.add(ansDto);
        }
        qDto.put("answers", answersDto);
        return qDto;
    }

    private ResponseEntity<Map<String, Object>> createTestDetailResponse(Test test) {
        List<Map<String, Object>> questionsDto = test.getQuestions().stream()
                .map(this::getStringObjectMap)
                .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("id", test.getId());
        result.put("title", test.getTitle());
        result.put("questions", questionsDto);

        return ResponseEntity.ok(result);
    }
}