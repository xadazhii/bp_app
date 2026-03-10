package com.xadazhii.server.controllers;

import com.xadazhii.server.models.*;
import com.xadazhii.server.payload.request.TestRequest;
import com.xadazhii.server.payload.request.TestResultRequest;
import com.xadazhii.server.payload.response.TestSummaryResponse;
import com.xadazhii.server.payload.response.MessageResponse;
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
import com.xadazhii.server.models.GlobalSettings;
import com.xadazhii.server.repository.GlobalSettingsRepository;
import com.xadazhii.server.repository.StudentAnswerRepository;
import org.springframework.security.core.Authentication;

@CrossOrigin(origins = { "https://btsss-stu-fei.netlify.app", "http://localhost:3000" }, maxAge = 3600)
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

    @Autowired
    private GlobalSettingsRepository globalSettingsRepository;

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private UserProgressRepository userProgressRepository;

    @Autowired
    private StudentAnswerRepository studentAnswerRepository;

    private int getCurrentWeek() {
        GlobalSettings settings = globalSettingsRepository.findById(1L).orElse(null);
        if (settings == null || settings.getSemesterStartDate() == null) {
            return 0; // default to 0 if no date is set
        }
        java.time.LocalDateTime start = settings.getSemesterStartDate();
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        if (now.isBefore(start)) {
            return 0;
        }
        return (int) java.time.temporal.ChronoUnit.MINUTES.between(start, now) + 1;
    }

    private boolean hasCompletedWeekMaterials(Long userId, int weekNumber) {
        List<Material> weekMaterials = materialRepository.findAll().stream()
                .filter(m -> m.getWeekNumber() != null && m.getWeekNumber() == weekNumber)
                .collect(Collectors.toList());

        if (weekMaterials.isEmpty()) {
            return true;
        }
        Set<Long> completedIds = userProgressRepository.findCompletedMaterialIdsByUserId(userId);
        return weekMaterials.stream().allMatch(m -> completedIds.contains(m.getId()));
    }

    private boolean isWeekTestCompleted(Long userId, int weekNumber, List<Test> allTests) {
        return allTests.stream()
                .filter(t -> t.getWeekNumber() != null && t.getWeekNumber() == weekNumber)
                .anyMatch(t -> testResultRepository.existsByStudentIdAndTestId(userId, t.getId()));
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public List<TestSummaryResponse> getAllTests(
            @RequestParam(value = "all", required = false, defaultValue = "false") boolean all) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (all && isAdmin) { // Changed 'all != null && all' to just 'all' as 'all' is a primitive boolean
            return testRepository.findAll().stream().map(test -> { // Changed return type to match method signature
                int questionCount = test.getQuestions().size();
                int totalPoints = test.getQuestions().stream()
                        .mapToInt(Question::getPoints)
                        .sum();
                return new TestSummaryResponse(test.getId(), test.getTitle(), questionCount, totalPoints,
                        test.getWeekNumber(), test.getExamDateTime(), test.getTimeLimit(), true);
            }).collect(Collectors.toList());
        }

        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsImpl)) {
            return Collections.emptyList();
        }
        Long userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        int currentWeek = getCurrentWeek();

        List<Test> tests = testRepository.findAll();

        boolean week12Completed = isWeekTestCompleted(userId, 12, tests);
        boolean week13Completed = isWeekTestCompleted(userId, 13, tests);

        java.util.TimeZone tz = java.util.TimeZone.getTimeZone("Europe/Bratislava");
        java.time.LocalDateTime now = java.time.LocalDateTime.now(tz.toZoneId());

        List<TestSummaryResponse> response = tests.stream()
                .filter(t -> {
                    Integer wn = t.getWeekNumber();
                    if (wn == null)
                        return false;
                    if (wn == 0)
                        return true;
                    if (wn >= 1 && wn <= 12)
                        return (wn <= currentWeek) && hasCompletedWeekMaterials(userId, wn);
                    if (wn == 13)
                        return week12Completed;
                    if (wn == 14) {
                        boolean timeReached = t.getExamDateTime() == null || now.isAfter(t.getExamDateTime());
                        return week13Completed && timeReached;
                    }
                    return false;
                })
                .map(test -> {
                    int questionCount = test.getQuestions().size();
                    int totalPoints = test.getQuestions().stream()
                            .mapToInt(Question::getPoints)
                            .sum();

                    boolean isAvailable = true;
                    if (test.getWeekNumber() != null && test.getWeekNumber() == 14) {
                        isAvailable = test.getExamDateTime() == null || now.isAfter(test.getExamDateTime());
                    }

                    return new TestSummaryResponse(test.getId(), test.getTitle(), questionCount, totalPoints,
                            test.getWeekNumber(), test.getExamDateTime(), test.getTimeLimit(), isAvailable);
                })
                .collect(Collectors.toList());

        return response;
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
        newTest.setWeekNumber(testRequest.getWeekNumber() != null ? testRequest.getWeekNumber() : 0);
        newTest.setExamDateTime(testRequest.getExamDateTime());
        newTest.setTimeLimit(testRequest.getTimeLimit());

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
    @Transactional
    public ResponseEntity<?> deleteTest(@PathVariable @lombok.NonNull Long id) {
        try {
            Test test = testRepository.findById(java.util.Objects.requireNonNull(id))
                    .orElseThrow(() -> new NoSuchElementException("Test not found with id: " + id));

            // 1. Update student points and delete test results manually to ensure order
            List<TestResult> results = testResultRepository.findByTestId(id);
            for (TestResult result : results) {
                User student = result.getStudent();
                if (student != null) {
                    int currentPoints = student.getPoints() != null ? student.getPoints() : 0;
                    int newPoints = Math.max(0, currentPoints - result.getScore());
                    student.setPoints(newPoints);
                    userRepository.save(student);
                }
            }

            if (results != null)
                testResultRepository.deleteAll(results);
            testResultRepository.flush();

            // 2. Now delete the test itself (which includes questions and answers via
            // cascade)
            testRepository.delete(java.util.Objects.requireNonNull(test));
            testRepository.flush();

            return ResponseEntity.ok("Test deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Chyba pri odstraňovaní testu: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> updateTest(@PathVariable @lombok.NonNull Long id, @RequestBody TestRequest testRequest) {
        try {
            Test test = testRepository.findById(java.util.Objects.requireNonNull(id))
                    .orElseThrow(() -> new NoSuchElementException("Test not found with id: " + id));

            // When editing a test, we should probably clear old results to keep things
            // consistent, as the questions/answers might have changed significantly.
            List<TestResult> results = testResultRepository.findByTestId(id);
            for (TestResult result : results) {
                User student = result.getStudent();
                if (student != null) {
                    int currentPoints = student.getPoints() != null ? student.getPoints() : 0;
                    int newPoints = Math.max(0, currentPoints - result.getScore());
                    student.setPoints(newPoints);
                    userRepository.save(student);
                }
            }

            if (results != null)
                testResultRepository.deleteAll(results);
            testResultRepository.flush();

            test.setTitle(testRequest.getTitle());
            test.setWeekNumber(testRequest.getWeekNumber() != null ? testRequest.getWeekNumber() : 0);
            test.setExamDateTime(testRequest.getExamDateTime());
            test.setTimeLimit(testRequest.getTimeLimit());
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
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Chyba pri úprave testu: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getTest(@PathVariable @lombok.NonNull Long id) {
        Test test = testRepository.findById(java.util.Objects.requireNonNull(id))
                .orElseThrow(() -> new NoSuchElementException("Test not found with id: " + id));
        return createTestDetailResponse(test);
    }

    @GetMapping("/completed")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public ResponseEntity<Set<Long>> getCompletedTestIds() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Long studentId = userDetails.getId();
        Set<Long> completedTestIds = testResultRepository.findByStudentId(studentId).stream()
                .map(testResult -> testResult.getTest().getId())
                .collect(Collectors.toSet());
        return ResponseEntity.ok(completedTestIds);
    }

    @PostMapping("/results")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> saveTestResult(@RequestBody @lombok.NonNull TestResultRequest request) {
        try {
            System.out.println(
                    "Saving test result for student: " + request.getStudentId() + ", test: " + request.getTestId()
                            + ", cheated: " + request.isCheated());

            if (request.getStudentId() == null || request.getTestId() == null) {
                return ResponseEntity.badRequest().body("Internal error: Chýba ID študenta alebo testu.");
            }

            User student = userRepository.findById(java.util.Objects.requireNonNull(request.getStudentId()))
                    .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + request.getStudentId()));
            Test test = testRepository.findById(java.util.Objects.requireNonNull(request.getTestId()))
                    .orElseThrow(() -> new NoSuchElementException("Test not found with ID: " + request.getTestId()));

            TestResult result = new TestResult();
            result.setStudent(student);
            result.setTest(test);
            result.setCheated(request.isCheated());

            // Save parent first to establish identity
            result = testResultRepository.saveAndFlush(java.util.Objects.requireNonNull(result));

            int totalPoints = 0;

            if (request.getSubmissions() != null) {
                for (TestResultRequest.AnswerSubmission submission : request.getSubmissions()) {
                    if (submission.getQuestionId() == null)
                        continue;

                    Question question = questionRepository
                            .findById(java.util.Objects.requireNonNull(submission.getQuestionId()))
                            .orElseThrow(() -> new NoSuchElementException(
                                    "Question not found with ID: " + submission.getQuestionId()));

                    StudentAnswer studentAnswer = new StudentAnswer();
                    studentAnswer.setTestResult(result);
                    studentAnswer.setQuestion(question);

                    if ("CLOSED".equalsIgnoreCase(question.getType())) {
                        if (submission.getAnswerId() == null) {
                            studentAnswer.setCorrect(false);
                        } else {
                            Answer selectedAnswer = answerRepository
                                    .findById(java.util.Objects.requireNonNull(submission.getAnswerId()))
                                    .orElseThrow(() -> new NoSuchElementException(
                                            "Answer not found with ID: " + submission.getAnswerId()));

                            totalPoints += selectedAnswer.getPointsWeight();
                            studentAnswer.setSelectedAnswer(selectedAnswer);
                            studentAnswer.setCorrect(selectedAnswer.getPointsWeight() > 0);
                        }
                    } else if ("OPEN".equalsIgnoreCase(question.getType())) {
                        String studentText = submission.getTextResponse();
                        studentAnswer.setTextResponse(studentText);

                        boolean isMatchFound = false;

                        if (studentText != null && !studentText.trim().isEmpty()) {
                            String normalizedStudentText = studentText.replaceAll("\\s+", "").toLowerCase().replace(",",
                                    ".");

                            for (Answer acceptedVariant : question.getAnswers()) {
                                if (acceptedVariant.getAnswerText() == null)
                                    continue;

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

            if (request.isCheated()) {
                totalPoints = 0;
            }
            result.setScore(Math.max(totalPoints, 0));
            TestResult savedResult = testResultRepository.save(result);

            // Update user global points
            if (student != null) {
                student.setPoints(student.getPoints() + result.getScore());
                userRepository.save(student);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("testResultId", savedResult.getId());
            response.put("score", savedResult.getScore());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error saving test result: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal error: " + e.getMessage());
        }
    }

    @GetMapping("/results/{resultId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getTestResultDetails(@PathVariable @lombok.NonNull Long resultId) {
        TestResult result = testResultRepository.findById(java.util.Objects.requireNonNull(resultId))
                .orElseThrow(() -> new NoSuchElementException("Result not found with id: " + resultId));

        Map<String, Object> response = new HashMap<>();
        response.put("id", result.getId());
        response.put("testTitle", result.getTest().getTitle());
        response.put("score", result.getScore());
        response.put("cheated", result.isCheated());
        response.put("completedAt", result.getCompletedAt());

        List<Map<String, Object>> questionsDto = result.getTest().getQuestions().stream().map(q -> {
            Map<String, Object> qMap = new HashMap<>();
            qMap.put("questionId", q.getId());
            qMap.put("questionText", q.getQuestionText());
            qMap.put("type", q.getType());
            qMap.put("points", q.getPoints());

            List<Map<String, Object>> answersDto = q.getAnswers().stream().map(a -> {
                Map<String, Object> aMap = new HashMap<>();
                aMap.put("id", a.getId());
                aMap.put("text", a.getAnswerText());
                aMap.put("pointsWeight", a.getPointsWeight());
                return aMap;
            }).collect(Collectors.toList());
            qMap.put("allAnswers", answersDto);

            // Find student's answer for this question
            Optional<StudentAnswer> studentAnswerOpt = result.getSubmittedAnswers().stream()
                    .filter(sa -> sa.getQuestion().getId().equals(q.getId()))
                    .findFirst();

            if (studentAnswerOpt.isPresent()) {
                StudentAnswer sa = studentAnswerOpt.get();
                qMap.put("studentAnswerId", sa.getId());
                qMap.put("selectedAnswerId", sa.getSelectedAnswer() != null ? sa.getSelectedAnswer().getId() : null);
                qMap.put("studentTextResponse", sa.getTextResponse());
                qMap.put("isCorrect", sa.isCorrect());
                qMap.put("feedback", sa.getFeedback());

                // Calculate earned points for this question
                int earned = 0;
                if (sa.getEarnedPoints() != null) {
                    earned = sa.getEarnedPoints();
                } else if (sa.isCorrect()) {
                    if ("OPEN".equalsIgnoreCase(q.getType())) {
                        earned = q.getPoints();
                    } else if (sa.getSelectedAnswer() != null) {
                        earned = sa.getSelectedAnswer().getPointsWeight();
                        if (earned == 0)
                            earned = q.getPoints(); // Fallback if marked correct manually
                    } else {
                        earned = q.getPoints();
                    }
                }
                qMap.put("earnedPoints", earned);
            } else {
                qMap.put("studentAnswerId", null);
                qMap.put("selectedAnswerId", null);
                qMap.put("studentTextResponse", null);
                qMap.put("isCorrect", false);
                qMap.put("feedback", null);
                qMap.put("earnedPoints", 0);
            }

            return qMap;
        }).collect(Collectors.toList());

        response.put("details", questionsDto);
        return ResponseEntity.ok(response);

    }

    @PostMapping("/results/evaluate-answer")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> evaluateAnswer(@RequestBody @lombok.NonNull Map<String, Object> payload) {
        Long studentAnswerId = Long.valueOf(payload.get("studentAnswerId").toString());
        boolean isCorrect = (boolean) payload.get("isCorrect");
        String feedback = (String) payload.get("feedback");

        StudentAnswer sa = studentAnswerRepository.findById(java.util.Objects.requireNonNull(studentAnswerId))
                .orElseThrow(() -> new NoSuchElementException("StudentAnswer not found with id: " + studentAnswerId));

        sa.setCorrect(isCorrect);
        sa.setFeedback(feedback);

        if (payload.containsKey("earnedPoints") && payload.get("earnedPoints") != null) {
            sa.setEarnedPoints(Integer.valueOf(payload.get("earnedPoints").toString()));
        } else if (!isCorrect) {
            sa.setEarnedPoints(0);
        } else {
            // If marking as correct but no specific points provided, we keep it null or set
            // to max in recalculation
            sa.setEarnedPoints(null);
        }

        studentAnswerRepository.save(sa);

        // Recalculate total score for the TestResult
        TestResult result = sa.getTestResult();
        int oldResultScore = result.getScore();
        int newTotalScore = 0;
        for (StudentAnswer ans : result.getSubmittedAnswers()) {
            boolean currentIsCorrect;
            Integer currentEarnedPoints;

            if (ans.getId().equals(studentAnswerId)) {
                currentIsCorrect = isCorrect;
                currentEarnedPoints = sa.getEarnedPoints();
            } else {
                currentIsCorrect = ans.isCorrect();
                currentEarnedPoints = ans.getEarnedPoints();
            }

            if (currentEarnedPoints != null) {
                newTotalScore += currentEarnedPoints;
            } else if (currentIsCorrect) {
                Question q = ans.getQuestion();
                int maxQPoints = q.getAnswers().stream()
                        .mapToInt(Answer::getPointsWeight)
                        .max()
                        .orElse(q.getPoints());
                if (maxQPoints == 0)
                    maxQPoints = q.getPoints();
                if (maxQPoints == 0)
                    maxQPoints = 1; // absolute fallback

                if ("CLOSED".equalsIgnoreCase(q.getType()) && ans.getSelectedAnswer() != null) {
                    int weight = ans.getSelectedAnswer().getPointsWeight();
                    if (weight == 0)
                        weight = maxQPoints;
                    newTotalScore += weight;
                } else {
                    newTotalScore += maxQPoints;
                }
            }
        }

        if (result.isCheated()) {
            newTotalScore = 0;
        }

        result.setScore(newTotalScore);
        testResultRepository.saveAndFlush(result);

        // Update User's global points
        User student = result.getStudent();
        if (student != null) {
            int diff = newTotalScore - oldResultScore;
            student.setPoints(student.getPoints() + diff);
            userRepository.saveAndFlush(student);
        }

        return ResponseEntity.ok(new MessageResponse("Odpoveď bola úspešne prehodnotená!"));
    }

    @PostMapping("/results/{resultId}/toggle-cheat")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> toggleCheatStatus(@PathVariable @lombok.NonNull Long resultId) {
        TestResult result = testResultRepository.findById(java.util.Objects.requireNonNull(resultId))
                .orElseThrow(() -> new NoSuchElementException("TestResult not found with id: " + resultId));

        int oldScore = result.getScore();
        boolean newCheatedStatus = !result.isCheated();
        result.setCheated(newCheatedStatus);

        // Recalculate score
        int newTotalScore = 0;
        if (!newCheatedStatus) {
            for (StudentAnswer ans : result.getSubmittedAnswers()) {
                if (ans.isCorrect()) {
                    if (ans.getEarnedPoints() != null) {
                        newTotalScore += ans.getEarnedPoints();
                    } else {
                        Question q = ans.getQuestion();
                        int maxQPoints = q.getAnswers().stream()
                                .mapToInt(Answer::getPointsWeight)
                                .max()
                                .orElse(q.getPoints());
                        if (maxQPoints == 0)
                            maxQPoints = q.getPoints();
                        if (maxQPoints == 0)
                            maxQPoints = 1;

                        if ("CLOSED".equalsIgnoreCase(q.getType()) && ans.getSelectedAnswer() != null) {
                            int weight = ans.getSelectedAnswer().getPointsWeight();
                            if (weight == 0)
                                weight = maxQPoints;
                            newTotalScore += weight;
                        } else {
                            newTotalScore += maxQPoints;
                        }
                    }
                }
            }
        } else {
            newTotalScore = 0;
        }

        result.setScore(newTotalScore);
        testResultRepository.saveAndFlush(result);

        // Update User points
        User student = result.getStudent();
        if (student != null) {
            int diff = newTotalScore - oldScore;
            student.setPoints(student.getPoints() + diff);
            userRepository.saveAndFlush(student);
        }

        return ResponseEntity.ok(new MessageResponse("Status podvádzania bol úspešne zmenený!"));
    }

    @DeleteMapping("/results/{resultId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> deleteTestResult(@PathVariable @lombok.NonNull Long resultId) {
        TestResult result = testResultRepository.findById(java.util.Objects.requireNonNull(resultId))
                .orElseThrow(() -> new NoSuchElementException("TestResult not found with id: " + resultId));

        int score = result.getScore();
        User student = result.getStudent();

        if (student != null) {
            student.setPoints(student.getPoints() - score);
            userRepository.saveAndFlush(student);
        }

        testResultRepository.delete(result);

        return ResponseEntity.ok(new MessageResponse("Test bol úspešne vynulovaný."));
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
        result.put("examDateTime", test.getExamDateTime());
        result.put("weekNumber", test.getWeekNumber());
        result.put("timeLimit", test.getTimeLimit());
        result.put("questions", questionsDto);

        return ResponseEntity.ok(result);
    }
}