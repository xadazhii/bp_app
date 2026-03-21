package com.xadazhii.server.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xadazhii.server.models.*;
import com.xadazhii.server.payload.request.TestRequest;
import com.xadazhii.server.payload.request.TestResultRequest;
import com.xadazhii.server.payload.response.TestSummaryResponse;
import com.xadazhii.server.repository.*;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class TestService {

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private TestResultRepository testResultRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentAnswerRepository studentAnswerRepository;

    @Autowired
    private GlobalSettingsRepository globalSettingsRepository;

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private UserProgressRepository userProgressRepository;

    @Transactional(readOnly = true)
    public List<TestSummaryResponse> getTests(boolean all, Long userId) {
        final boolean isStudentView = !all;
        final Set<Long> completedMaterialIds = (userId != null)
                ? userProgressRepository.findCompletedMaterialIdsByUserId(userId)
                : null;

        List<Test> testList;
        if (all) {
            testList = testRepository.findAllWithQuestions();
        } else {
            GlobalSettings settings = globalSettingsRepository.findAll().stream().findFirst().orElse(null);
            int currentWeekValue = 0;
            if (settings != null && settings.getSemesterStartDate() != null) {
                long startMs = settings.getSemesterStartDate().atZone(ZoneId.of("Europe/Bratislava")).toInstant().toEpochMilli();
                long diffInMs = Instant.now().toEpochMilli() - startMs;
                // 1 minute = 1 week (for testing purposes)
                int week = (int) (diffInMs / 60000L) + 1;
                currentWeekValue = Math.max(0, week);
            }
            final int finalWeek = currentWeekValue;

            testList = testRepository.findAllWithQuestions().stream()
                    .filter(test -> {
                        if (test.getExamDateTime() != null) return true;
                        Integer w = test.getWeekNumber();
                        if (w == null || w <= 0) return true;
                        if (w <= 13) {
                            if (w > finalWeek) return false;
                            List<Material> weekMaterials = materialRepository.findByWeekNumber(w);
                            if (weekMaterials.isEmpty()) return false;
                            return (completedMaterialIds != null && weekMaterials.stream().allMatch(m -> completedMaterialIds.contains(m.getId())));
                        }
                        return w <= finalWeek;
                    })
                    .collect(Collectors.toList());
        }

        return testList.stream().map(test -> {
            TestSummaryResponse response = new TestSummaryResponse();
            response.setId(test.getId());
            response.setTitle(test.getTitle());
            response.setWeekNumber(test.getWeekNumber());
            response.setExamDateTime(test.getExamDateTime());
            response.setTimeLimit(test.getTimeLimit());

            boolean available = true;
            if (isStudentView && userId != null) {
                if (test.getExamDateTime() != null) {
                    LocalDateTime now = LocalDateTime.now(ZoneId.of("Europe/Bratislava"));
                    available = now.isAfter(test.getExamDateTime());
                } else if (test.getWeekNumber() != null && test.getWeekNumber() > 0 && test.getWeekNumber() <= 12) {
                    List<Material> weekMaterials = materialRepository.findByWeekNumber(test.getWeekNumber());
                    if (weekMaterials.isEmpty()) {
                        available = false;
                    } else {
                        available = completedMaterialIds != null && weekMaterials.stream().allMatch(m -> completedMaterialIds.contains(m.getId()));
                    }
                }
            }
            response.setAvailable(available);

            List<Question> questions = test.getQuestions();
            int totalQ = (questions != null) ? questions.size() : 0;
            int limit = getQuestionLimit(test.getWeekNumber());

            if (isStudentView && userId != null && limit > 0 && totalQ > limit) {
                response.setQuestionCount(limit);
                List<Question> shuffled = new ArrayList<>(questions);
                shuffled.sort(Comparator.comparing(Question::getId));
                Collections.shuffle(shuffled, new Random(Objects.hash(userId, test.getId())));
                response.setTotalPoints(shuffled.subList(0, limit).stream().mapToInt(Question::getPoints).sum());
            } else {
                response.setQuestionCount(totalQ);
                response.setTotalPoints((questions != null) ? questions.stream().mapToInt(Question::getPoints).sum() : 0);
            }
            return response;
        }).collect(Collectors.toList());
    }

    private int getQuestionLimit(Integer week) {
        if (week == null) return 0;
        if (week >= 1 && week <= 12) return 8;
        if (week == 14) return 25;
        return 0;
    }

    @Transactional
    public Test createTest(TestRequest testRequest) {
        Test newTest = new Test();
        updateTestFields(newTest, java.util.Objects.requireNonNull(testRequest));
        return testRepository.save(newTest);
    }

    @Transactional
    public Test updateTest(Long id, TestRequest testRequest) {
        Test test = testRepository.findById(java.util.Objects.requireNonNull(id))
                .orElseThrow(() -> new NoSuchElementException("Test s id " + id + " nebol nájdený"));

        List<TestResult> results = testResultRepository.findByTestId(id);
        for (TestResult result : results) {
            User student = result.getStudent();
            if (student != null) {
                int currentPoints = student.getPoints() != null ? student.getPoints() : 0;
                student.setPoints(Math.max(0, currentPoints - result.getScore()));
                userRepository.save(student);
            }
        }
        if (!results.isEmpty()) {
            testResultRepository.deleteAll(results);
            testResultRepository.flush();
        }

        updateTestFields(test, java.util.Objects.requireNonNull(testRequest));
        return testRepository.save(java.util.Objects.requireNonNull(test));
    }

    private void updateTestFields(Test test, TestRequest testRequest) {
        test.setTitle(testRequest.getTitle());
        test.setWeekNumber(testRequest.getWeekNumber() != null ? testRequest.getWeekNumber() : 0);
        test.setExamDateTime(testRequest.getExamDateTime());
        test.setTimeLimit(testRequest.getTimeLimit());

        List<Question> questions = new ArrayList<>();
        if (testRequest.getQuestions() != null) {
            for (TestRequest.QuestionDTO qdto : testRequest.getQuestions()) {
                questions.add(mapToQuestion(qdto, test));
            }
        }
        test.setQuestions(questions);
    }

    private Question mapToQuestion(TestRequest.QuestionDTO qdto, Test test) {
        Question q = new Question();
        q.setQuestionText(qdto.getQuestion());
        q.setPoints(qdto.getPoints());
        q.setType(qdto.getType() != null ? qdto.getType() : "CLOSED");
        q.setTest(test);

        List<Answer> answers = new ArrayList<>();
        if (qdto.getAnswers() != null) {
            for (TestRequest.AnswerDTO adto : qdto.getAnswers()) {
                Answer a = new Answer();
                a.setAnswerText(adto.getText());
                a.setPointsWeight(adto.getPointsWeight());
                a.setQuestion(q);
                answers.add(a);
            }
        }
        q.setAnswers(answers);
        return q;
    }

    @Transactional
    public void deleteTest(Long id) {
        Test test = testRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new NoSuchElementException("Test s id " + id + " nebol nájdený"));

        List<TestResult> results = testResultRepository.findByTestId(id);
        for (TestResult result : results) {
            User student = result.getStudent();
            if (student != null) {
                int currentPoints = student.getPoints() != null ? student.getPoints() : 0;
                student.setPoints(Math.max(0, currentPoints - result.getScore()));
                userRepository.save(student);
            }
        }
        if (!results.isEmpty()) {
            testResultRepository.deleteAll(results);
        }
        testRepository.delete(java.util.Objects.requireNonNull(test));
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getTestDetail(Long id, boolean full, Long userId) {
        Test test = testRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new NoSuchElementException("Test s id " + id + " nebol nájdený"));

        List<Map<String, Object>> questionsDto = test.getQuestions().stream()
                .map(this::mapQuestionToDto)
                .collect(Collectors.toCollection(ArrayList::new));

        if (!full && userId != null) {
            int limit = getQuestionLimit(test.getWeekNumber());
            Collections.shuffle(questionsDto, new Random(Objects.hash(userId, test.getId())));
            if (limit > 0 && questionsDto.size() > limit) {
                questionsDto = questionsDto.subList(0, limit);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("id", test.getId());
        result.put("title", test.getTitle());
        result.put("examDateTime", test.getExamDateTime());
        result.put("weekNumber", test.getWeekNumber());
        result.put("timeLimit", test.getTimeLimit());
        result.put("questions", questionsDto);
        return result;
    }

    private Map<String, Object> mapQuestionToDto(Question q) {
        Map<String, Object> qDto = new HashMap<>();
        qDto.put("questionId", q.getId());
        qDto.put("question", q.getQuestionText());
        qDto.put("type", q.getType());
        qDto.put("points", q.getPoints());

        List<Map<String, Object>> answersDto = q.getAnswers().stream().map(a -> {
            Map<String, Object> ansDto = new HashMap<>();
            ansDto.put("answerId", a.getId());
            ansDto.put("text", a.getAnswerText());
            ansDto.put("pointsWeight", a.getPointsWeight());
            return ansDto;
        }).collect(Collectors.toList());
        qDto.put("answers", answersDto);
        return qDto;
    }

    @Transactional
    public Map<String, Object> saveTestResult(TestResultRequest request) {
        User student = userRepository.findById(java.util.Objects.requireNonNull(request.getStudentId()))
                .orElseThrow(() -> new NoSuchElementException("Používateľ s ID " + request.getStudentId() + " nebol nájdený"));
        Test test = testRepository.findById(java.util.Objects.requireNonNull(request.getTestId()))
                .orElseThrow(() -> new NoSuchElementException("Test s ID " + request.getTestId() + " nebol nájdený"));

        TestResult result = new TestResult();
        result.setStudent(student);
        result.setTest(test);
        result.setCheated(request.isCheated());
        result.setCompletedAt(LocalDateTime.now());
        result = java.util.Objects.requireNonNull(testResultRepository.saveAndFlush(result));

        int totalPoints = 0;
        if (request.getSubmissions() != null) {
            for (TestResultRequest.AnswerSubmission submission : request.getSubmissions()) {
                Question question = questionRepository.findById(Objects.requireNonNull(submission.getQuestionId()))
                        .orElseThrow(() -> new NoSuchElementException("Otázka s ID " + submission.getQuestionId() + " nebola nájdená"));

                StudentAnswer sa = new StudentAnswer();
                sa.setTestResult(result);
                sa.setQuestion(question);

                if ("CLOSED".equalsIgnoreCase(question.getType()) || "MULTIPLE".equalsIgnoreCase(question.getType())) {
                    List<Long> ids = submission.getAnswerIds();
                    if (ids == null || ids.isEmpty()) {
                        if (submission.getAnswerId() != null) ids = Collections.singletonList(submission.getAnswerId());
                    }

                    if (ids != null && !ids.isEmpty()) {
                        List<Answer> selected = new ArrayList<>();
                        int qPoints = 0;
                        for (Long aid : ids) {
                            Answer a = answerRepository.findById(java.util.Objects.requireNonNull(aid)).orElse(null);
                            if (a != null) {
                                selected.add(a);
                                if (a.getPointsWeight() > 0) qPoints += a.getPointsWeight();
                                else if (!a.getAnswerText().toLowerCase().contains("neviem")) qPoints -= 1;
                            }
                        }
                        sa.setSelectedAnswers(selected);
                        sa.setCorrect(qPoints > 0);
                        sa.setEarnedPoints(qPoints);
                        if (selected.size() == 1) sa.setSelectedAnswer(selected.get(0));
                        totalPoints += qPoints;
                    }
                } else if ("OPEN".equalsIgnoreCase(question.getType())) {
                    String text = submission.getTextResponse();
                    sa.setTextResponse(text);
                    boolean match = false;
                    if (text != null && !text.trim().isEmpty()) {
                        String norm = text.replaceAll("\\s+", "").toLowerCase().replace(",", ".");
                        for (Answer variant : question.getAnswers()) {
                            if (variant.getAnswerText() == null) continue;
                            String vNorm = variant.getAnswerText().replaceAll("\\s+", "").toLowerCase().replace(",", ".");
                            if (norm.contains(vNorm)) {
                                totalPoints += variant.getPointsWeight();
                                sa.setCorrect(variant.getPointsWeight() > 0);
                                match = true;
                                break;
                            }
                        }
                    }
                    if (!match) sa.setCorrect(false);
                }
                result.getSubmittedAnswers().add(sa);
            }
        }

        if (request.isCheated()) totalPoints = 0;
        result.setScore(totalPoints);
        student.setPoints(student.getPoints() + totalPoints);
        userRepository.save(student);
        testResultRepository.save(result);

        Map<String, Object> resp = new HashMap<>();
        resp.put("testResultId", result.getId());
        resp.put("score", result.getScore());
        return resp;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getTestResultDetails(Long resultId) {
        TestResult result = testResultRepository.findById(Objects.requireNonNull(resultId))
                .orElseThrow(() -> new NoSuchElementException("Výsledok nebol nájdený pre ID: " + resultId));

        Map<String, Object> resp = new HashMap<>();
        resp.put("id", result.getId());
        resp.put("testTitle", result.getTest().getTitle());
        resp.put("score", result.getScore());
        resp.put("cheated", result.isCheated());
        resp.put("completedAt", result.getCompletedAt());

        List<Map<String, Object>> details = result.getSubmittedAnswers().stream().map(sa -> {
            Question q = sa.getQuestion();
            Map<String, Object> qMap = new HashMap<>();
            qMap.put("questionId", q.getId());
            qMap.put("questionText", q.getQuestionText());
            qMap.put("type", q.getType());
            qMap.put("points", q.getPoints());
            qMap.put("allAnswers", q.getAnswers().stream().map(a -> {
                Map<String, Object> am = new HashMap<>();
                am.put("id", a.getId());
                am.put("text", a.getAnswerText());
                am.put("pointsWeight", a.getPointsWeight());
                return am;
            }).collect(Collectors.toList()));
            qMap.put("selectedAnswerIds", sa.getSelectedAnswers().stream().map(Answer::getId).collect(Collectors.toList()));
            qMap.put("studentTextResponse", sa.getTextResponse());
            qMap.put("isCorrect", sa.isCorrect());
            qMap.put("feedback", sa.getFeedback());
            qMap.put("earnedPoints", getEarnedPoints(sa));
            return qMap;
        }).collect(Collectors.toList());

        resp.put("details", details);
        return resp;
    }

    private int getEarnedPoints(StudentAnswer sa) {
        if (sa.getEarnedPoints() != null) return sa.getEarnedPoints();
        if (!sa.isCorrect()) return 0;
        Question q = sa.getQuestion();
        if ("OPEN".equalsIgnoreCase(q.getType())) return q.getPoints();

        List<Answer> selected = new ArrayList<>(sa.getSelectedAnswers());
        if (selected.isEmpty() && sa.getSelectedAnswer() != null) selected.add(sa.getSelectedAnswer());
        int earned = 0;
        for (Answer a : selected) {
            if (a.getPointsWeight() > 0) earned += a.getPointsWeight();
            else if (!a.getAnswerText().toLowerCase().contains("neviem")) earned -= 1;
        }
        return (earned == 0 && sa.isCorrect()) ? q.getPoints() : earned;
    }

    @Transactional
    public void evaluateAnswer(Map<String, Object> payload) {
        Long saId = Long.valueOf(payload.get("studentAnswerId").toString());
        boolean correct = (boolean) payload.get("isCorrect");
        String feedback = (String) payload.get("feedback");

        StudentAnswer sa = studentAnswerRepository.findById(Objects.requireNonNull(saId))
                .orElseThrow(() -> new NoSuchElementException("Odpoveď nebola nájdená"));

        sa.setCorrect(correct);
        sa.setFeedback(feedback);
        if (payload.get("earnedPoints") != null) sa.setEarnedPoints(Integer.valueOf(payload.get("earnedPoints").toString()));
        else sa.setEarnedPoints(correct ? null : 0);
        studentAnswerRepository.save(sa);

        TestResult result = sa.getTestResult();
        int oldScore = result.getScore();
        int newScore = 0;
        if (!result.isCheated()) {
            for (StudentAnswer ans : result.getSubmittedAnswers()) {
                newScore += getEarnedPoints(ans);
            }
        }
        result.setScore(newScore);
        testResultRepository.saveAndFlush(result);

        User student = result.getStudent();
        if (student != null) {
            student.setPoints(student.getPoints() + (newScore - oldScore));
            userRepository.save(student);
        }
    }

    @Transactional
    public void toggleCheatStatus(Long resultId) {
        TestResult result = testResultRepository.findById(Objects.requireNonNull(resultId))
                .orElseThrow(() -> new NoSuchElementException("Výsledok nebol nájdený"));

        int oldScore = result.getScore();
        result.setCheated(!result.isCheated());
        int newScore = 0;
        if (!result.isCheated()) {
            for (StudentAnswer ans : result.getSubmittedAnswers()) newScore += getEarnedPoints(ans);
        }
        result.setScore(newScore);
        testResultRepository.saveAndFlush(result);

        User student = result.getStudent();
        if (student != null) {
            student.setPoints(student.getPoints() + (newScore - oldScore));
            userRepository.save(student);
        }
    }

    @Transactional
    public void deleteTestResult(Long resultId) {
        TestResult result = testResultRepository.findById(Objects.requireNonNull(resultId))
                .orElseThrow(() -> new NoSuchElementException("Výsledok nebol nájdený"));
        User student = result.getStudent();
        if (student != null) {
            student.setPoints(Math.max(0, student.getPoints() - result.getScore()));
            userRepository.save(Objects.requireNonNull(student));
        }
        testResultRepository.delete(Objects.requireNonNull(result));
    }

    @Transactional
    public int importFromFile(MultipartFile file, String type, Integer weekNumber) throws Exception {
        String fileName = file.getOriginalFilename();
        if (fileName != null && fileName.toLowerCase().endsWith(".csv")) {
            return importFromCsv(file, type, weekNumber);
        }
        return importFromExcel(file, type, weekNumber);
    }

    private int importFromExcel(MultipartFile file, String type, Integer weekNumber) throws Exception {
        Path temp = Files.createTempFile("test_import_", ".xlsx");
        Files.copy(file.getInputStream(), temp, StandardCopyOption.REPLACE_EXISTING);
        try {
            ProcessBuilder pb = new ProcessBuilder("python3", "excel_parser.py", temp.toString());
            // Use current working directory as the script is located in the same directory as the JAR
            pb.directory(new File("."));
            Process p = pb.start();
            String output;
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream(), StandardCharsets.UTF_8))) {
                output = reader.lines().collect(Collectors.joining("\n"));
            }
            if (p.waitFor() != 0) throw new RuntimeException("Python error: " + output);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(output);
            String generalTopic = root.get("topic").asText("Importovaný test");
            List<Test> tests = new ArrayList<>();

            for (JsonNode weekNode : root.get("weeks")) {
                Test t = new Test();
                t.setType(type);
                
                // If weekNumber is -1, it means "All weekly tests", use file's weekNumber.
                // Otherwise, it's a specific selection (Entry=0, Weekly=1-12, Final=13, Exam=14), so override.
                int assignedWeek;
                if (weekNumber == -1) {
                    assignedWeek = weekNode.get("weekNumber").asInt();
                    if (assignedWeek < 0) assignedWeek = 1; // Default to week 1 only if negative
                } else {
                    assignedWeek = weekNumber;
                }
                
                t.setWeekNumber(assignedWeek);
                t.setTitle(getAutoTitle(assignedWeek, type, generalTopic));

                List<Question> qs = new ArrayList<>();
                for (JsonNode qn : weekNode.get("questions")) {
                    Question q = new Question();
                    q.setQuestionText(qn.get("questionText").asText());
                    q.setTest(t);
                    String correct = qn.get("correctAnswers").asText().toUpperCase();
                    q.setType(correct.length() > 1 ? "MULTIPLE" : "CLOSED");

                    List<Answer> ans = new ArrayList<>();
                    int cCount = 0;
                    for (JsonNode an : qn.get("answers")) {
                        String text = an.get("text").asText().trim();
                        if (text.isEmpty()) continue;
                        Answer a = new Answer();
                        a.setAnswerText(text);
                        a.setQuestion(q);
                        String letter = an.get("letter").asText();
                        if (letter.equals("NEVIEM")) a.setPointsWeight(0);
                        else if (correct.contains(letter)) { a.setPointsWeight(1); cCount++; }
                        else a.setPointsWeight(-1);
                        ans.add(a);
                    }
                    q.setPoints(Math.max(1, cCount));
                    q.setAnswers(ans);
                    qs.add(q);
                }
                if (!qs.isEmpty()) { t.setQuestions(qs); tests.add(t); }
            }
            if (!tests.isEmpty()) {
                testRepository.saveAll(tests);
            }
            return tests.size();
        } finally {
            Files.deleteIfExists(temp);
        }
    }

    private int importFromCsv(MultipartFile file, String type, Integer weekNumber) throws Exception {
        CSVFormat format = CSVFormat.EXCEL.builder().setDelimiter(';').setIgnoreEmptyLines(true).setTrim(true).build();
        try (BufferedReader r = new BufferedReader(new InputStreamReader(file.getInputStream(), "UTF-8"));
             CSVParser p = new CSVParser(r, format)) {
            List<CSVRecord> recs = p.getRecords();
            
            // If weekNumber is not -1, force that week for everything
            int startW;
            if (weekNumber == -1) {
                startW = 1; // Default starting for sequence
            } else {
                startW = weekNumber;
            }

            Test cur = new Test(); 
            cur.setType(type); 
            cur.setWeekNumber(startW); 
            cur.setTitle(getAutoTitle(startW, type, "CSV Import"));

            List<Test> allTests = new ArrayList<>();
            List<Question> qs = new ArrayList<>();
            Pattern ptn = Pattern.compile("^(\\d+)\\.\\s*(.*)");

            for (int i = 3; i < recs.size(); i++) {
                CSVRecord rec = recs.get(i);
                if (rec.size() < 2) continue;
                String txt = rec.get(1).trim();
                if (txt.isEmpty()) continue;

                Matcher m = ptn.matcher(txt);
                if (m.matches()) {
                    // New week separator found
                    if (!qs.isEmpty()) { 
                        cur.setQuestions(qs); 
                        allTests.add(cur); 
                    }
                    
                    int w;
                    if (weekNumber == -1) {
                        w = Integer.parseInt(m.group(1));
                    } else {
                        w = weekNumber; // Override even if file says different
                    }
                    
                    cur = new Test(); 
                    cur.setType(type);
                    cur.setWeekNumber(w); 
                    cur.setTitle(getAutoTitle(w, type, "CSV Import"));
                    qs = new ArrayList<>();
                    continue;
                }
                if (txt.equalsIgnoreCase("otázka") || txt.equalsIgnoreCase("nan")) continue;

                Question q = new Question(); q.setQuestionText(txt); q.setTest(cur);
                String correct = rec.size() > 7 ? rec.get(7).toUpperCase().trim() : "";
                q.setType(correct.length() > 1 ? "MULTIPLE" : "CLOSED");

                List<Answer> ans = new ArrayList<>();
                String[] opts = { rec.size() > 2 ? rec.get(2) : "", rec.size() > 3 ? rec.get(3) : "", rec.size() > 4 ? rec.get(4) : "", rec.size() > 5 ? rec.get(5) : "", rec.size() > 6 ? rec.get(6) : "" };
                String[] ltrs = { "A", "B", "C", "D", "NEVIEM" };
                int cCount = 0;
                for (int j = 0; j < opts.length; j++) {
                    if (opts[j].trim().isEmpty()) continue;
                    Answer a = new Answer(); a.setAnswerText(opts[j]); a.setQuestion(q);
                    if (ltrs[j].equals("NEVIEM")) a.setPointsWeight(0);
                    else if (correct.contains(ltrs[j])) { a.setPointsWeight(1); cCount++; }
                    else a.setPointsWeight(-1);
                    ans.add(a);
                }
                q.setPoints(Math.max(1, cCount)); q.setAnswers(ans); qs.add(q);
            }
            if (!qs.isEmpty()) { 
                cur.setQuestions(qs); 
                allTests.add(cur); 
            }
            if (!allTests.isEmpty()) {
                testRepository.saveAll(allTests);
            }
            return allTests.size();
        }
    }

    private String getAutoTitle(int week, String type, String fallback) {
        if (week == 0) return "Vstupný test";
        if (week >= 1 && week <= 12) return "Test " + week;
        if (week == 13) return "Záverečný test";
        if (week == 14 || "EXAM".equalsIgnoreCase(type)) return "Skúška";
        return fallback;
    }
}
