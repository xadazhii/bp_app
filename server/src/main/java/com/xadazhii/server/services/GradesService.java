package com.xadazhii.server.services;

import com.xadazhii.server.models.*;
import com.xadazhii.server.payload.response.GradeTestInfo;
import com.xadazhii.server.payload.response.GradesSummaryResponse;
import com.xadazhii.server.payload.response.StudentGradeInfo;
import com.xadazhii.server.repository.TestRepository;
import com.xadazhii.server.repository.TestResultRepository;
import com.xadazhii.server.repository.UserProgressRepository;
import com.xadazhii.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GradesService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private TestResultRepository testResultRepository;

    @Autowired
    private UserProgressRepository userProgressRepository;

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getLeaderboard(Long currentUserId) {
        List<User> students = userRepository.findAll().stream()
                .filter(u -> u.getRoles().stream().noneMatch(r -> r.getName() == ERole.ROLE_ADMIN))
                .collect(Collectors.toList());
        Set<Long> studentIds = students.stream().map(User::getId).collect(Collectors.toSet());

        List<TestResult> allResults = testResultRepository.findAll().stream()
                .filter(r -> r.getStudent() != null && studentIds.contains(r.getStudent().getId()))
                .collect(Collectors.toList());

        Map<Long, Map<Long, Integer>> bestTestScores = allResults.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getStudent().getId(),
                        Collectors.toMap(
                                r -> r.getTest().getId(),
                                TestResult::getScore,
                                (a, b) -> Math.max(a, b))));

        List<Object[]> learningCounts = userProgressRepository.countCompletedLearningMaterialsByUserAndType();
        Map<Long, Integer> learningPoints = new HashMap<>();
        for (Object[] row : learningCounts) {
            Long userId = (Long) row[0];
            if (!studentIds.contains(userId)) continue;
            String type = (String) row[1];
            long count = (Long) row[2];
            int pts = "lecture".equalsIgnoreCase(type) ? (int) count * 2 : ("seminar".equalsIgnoreCase(type) ? (int) count * 3 : 0);
            learningPoints.put(userId, learningPoints.getOrDefault(userId, 0) + pts);
        }

        return students.stream()
                .map(user -> {
                    Long userId = user.getId();
                    int testTotal = bestTestScores.getOrDefault(userId, Collections.emptyMap()).values().stream().mapToInt(i -> i).sum();
                    int learnTotal = learningPoints.getOrDefault(userId, 0);
                    int total = testTotal + learnTotal;

                    Map<String, Object> map = new HashMap<>();
                    boolean isMe = userId.equals(currentUserId);
                    String name;
                    if (isMe) {
                        name = (user.getPseudonym() != null && !user.getPseudonym().isBlank()) ? user.getPseudonym() : user.getUsername();
                        map.put("username", name);
                        map.put("isCurrentUser", true);
                    } else {
                        if (user.getPseudonym() != null && !user.getPseudonym().isBlank()) {
                            name = user.getPseudonym();
                        } else {
                            name = "Študent " + userId;
                            String uname = user.getUsername();
                            if (uname != null && !uname.isEmpty()) {
                                String first = uname.split(" ")[0];
                                name = first.length() > 3 ? first.substring(0, 3) + "***" : first + "***";
                            }
                        }
                        map.put("username", name);
                        map.put("isCurrentUser", false);
                    }
                    map.put("points", total);
                    map.put("testPoints", testTotal);
                    map.put("learningPoints", learnTotal);
                    return map;
                })
                .sorted((a, b) -> ((Integer) b.get("points")).compareTo((Integer) a.get("points")))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public GradesSummaryResponse getGradesSummary() {
        List<Test> tests = testRepository.findAll();
        List<User> students = userRepository.findAll().stream()
                .filter(u -> u.getRoles().stream().noneMatch(r -> r.getName() == ERole.ROLE_ADMIN))
                .collect(Collectors.toList());
        Set<Long> studentIds = students.stream().map(User::getId).collect(Collectors.toSet());

        List<TestResult> allResults = testResultRepository.findAllWithAnswersAndQuestions().stream()
                .filter(r -> r.getStudent() != null && studentIds.contains(r.getStudent().getId()))
                .collect(Collectors.toList());

        Map<Long, Map<Long, Integer>> scores = new HashMap<>();
        Map<Long, Map<Long, Boolean>> cheated = new HashMap<>();
        Map<Long, Map<Long, Long>> resultIdsMap = new HashMap<>();
        Map<Long, Map<Long, Integer>> maxScoresMap = new HashMap<>();

        for (TestResult r : allResults) {
            Long sId = r.getStudent().getId();
            Long tId = r.getTest().getId();

            scores.computeIfAbsent(sId, k -> new HashMap<>());
            cheated.computeIfAbsent(sId, k -> new HashMap<>());
            resultIdsMap.computeIfAbsent(sId, k -> new HashMap<>());
            maxScoresMap.computeIfAbsent(sId, k -> new HashMap<>());

            Integer oldScore = scores.get(sId).get(tId);
            if (oldScore == null || r.getScore() > oldScore) {
                scores.get(sId).put(tId, r.getScore());
                resultIdsMap.get(sId).put(tId, r.getId());
                cheated.get(sId).put(tId, r.isCheated());
                maxScoresMap.get(sId).put(tId, calculateAccurateMaxForStudentTest(r.getStudent().getId(), r.getTest()));
            }
        }

        List<GradeTestInfo> testInfos = tests.stream().map(t -> {
            Integer week = t.getWeekNumber();
            int limit = 0;
            if (week == null) limit = t.getQuestions().size();
            else if (week == 0) limit = 25;
            else if (week <= 12) limit = 8;
            else limit = 25;

            int actualQuestions = t.getQuestions() != null ? t.getQuestions().size() : 0;
            if (limit == 0 || limit > actualQuestions) {
                limit = actualQuestions;
            }

            // Calculate representative max score for the header
            int totalPossiblePoints = 0;
            if (t.getQuestions() != null) {
                totalPossiblePoints = t.getQuestions().stream().mapToInt(Question::getPoints).sum();
            }
            int representativeMax = 0;
            if (actualQuestions > 0) {
                representativeMax = (int) Math.round(((double) totalPossiblePoints / actualQuestions) * limit);
            }

            return new GradeTestInfo(t.getId(), t.getTitle(), representativeMax, week);
        }).collect(Collectors.toList());

        Test entryTest = tests.stream().filter(t -> Integer.valueOf(0).equals(t.getWeekNumber())).findFirst().orElse(null);
        Test exitTest = tests.stream().filter(t -> Integer.valueOf(13).equals(t.getWeekNumber())).findFirst().orElse(null);

        List<StudentGradeInfo> studentGrades = students.stream().map(s -> {
            Map<Long, Integer> sScores = scores.getOrDefault(s.getId(), Collections.emptyMap());
            Map<Long, Integer> sMaxScores = maxScoresMap.getOrDefault(s.getId(), Collections.emptyMap());
            Double normalizedGain = computeNormalizedGain(entryTest, exitTest, sScores, sMaxScores);

            return new StudentGradeInfo(
                    s.getId(), s.getUsername(), s.getEmail(),
                    sScores,
                    cheated.getOrDefault(s.getId(), Collections.emptyMap()),
                    resultIdsMap.getOrDefault(s.getId(), Collections.emptyMap()),
                    sMaxScores,
                    normalizedGain
            );
        }).collect(Collectors.toList());

        return new GradesSummaryResponse(testInfos, studentGrades);
    }

    private Double computeNormalizedGain(Test entryTest, Test exitTest,
                                         Map<Long, Integer> studentScores,
                                         Map<Long, Integer> studentMaxScores) {
        if (entryTest == null || exitTest == null) return null;
        Integer entryScore = studentScores.get(entryTest.getId());
        Integer exitScore = studentScores.get(exitTest.getId());
        if (entryScore == null || exitScore == null) return null;

        int entryMax = studentMaxScores.getOrDefault(entryTest.getId(), 0);
        int exitMax = studentMaxScores.getOrDefault(exitTest.getId(), 0);
        if (entryMax <= 0 || exitMax <= 0) return null;

        double entryPercent = ((double) entryScore / entryMax) * 100.0;
        double exitPercent = ((double) exitScore / exitMax) * 100.0;
        return HakeNormalizedGain.calculate(entryPercent, exitPercent);
    }

    private int calculateAccurateMaxForStudentTest(Long userId, Test test) {
        if (test.getQuestions() == null || test.getQuestions().isEmpty()) {
            return 0;
        }
        Integer week = test.getWeekNumber();
        int limit = 0;
        if (week != null) {
            if (week == 0) limit = 25;
            else if (week >= 1 && week <= 12) limit = 8;
            else if (week >= 13) limit = 25;
        }
        
        List<Question> finalQuestions;
        if (limit > 0) {
            List<Question> shuffled = new ArrayList<>(test.getQuestions());
            shuffled.sort(Comparator.comparing(Question::getId));
            Collections.shuffle(shuffled, new Random(Objects.hash(userId, test.getId())));
            finalQuestions = shuffled.size() > limit ? shuffled.subList(0, limit) : shuffled;
        } else {
            finalQuestions = test.getQuestions();
        }
        
        int total = 0;
        for (Question q : finalQuestions) {
            if ("OPEN".equalsIgnoreCase(q.getType())) {
                total += q.getPoints();
            } else if ("MULTIPLE".equalsIgnoreCase(q.getType())) {
                int qPossible = 0;
                for (Answer a : q.getAnswers()) {
                    if (a.getPointsWeight() > 0) qPossible += a.getPointsWeight();
                }
                total += Math.max(q.getPoints(), qPossible);
            } else {
                int qMax = 0;
                for (Answer a : q.getAnswers()) {
                    if (a.getPointsWeight() > qMax) qMax = a.getPointsWeight();
                }
                total += Math.max(q.getPoints(), qMax);
            }
        }
        return total;
    }

    public byte[] exportGradesToCsv() {
        List<User> students = userRepository.findAll().stream()
                .filter(u -> u.getRoles().stream().noneMatch(r -> r.getName() == ERole.ROLE_ADMIN))
                .collect(Collectors.toList());
        Set<Long> studentIds = students.stream().map(User::getId).collect(Collectors.toSet());

        List<TestResult> results = testResultRepository.findAll().stream()
                .filter(r -> r.getStudent() != null && studentIds.contains(r.getStudent().getId()))
                .collect(Collectors.toList());

        StringBuilder csv = new StringBuilder("\ufeffE-mail;Názov testu;Dosiahnuté body\n");
        for (TestResult r : results) {
            csv.append(r.getStudent().getEmail()).append(";")
               .append(r.getTest().getTitle()).append(";")
               .append(r.getScore()).append("\n");
        }
        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }
}