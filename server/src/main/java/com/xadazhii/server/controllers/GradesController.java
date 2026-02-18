package com.xadazhii.server.controllers;

import com.xadazhii.server.models.*;
import com.xadazhii.server.payload.response.GradeTestInfo;
import com.xadazhii.server.payload.response.GradesSummaryResponse;
import com.xadazhii.server.payload.response.StudentGradeInfo;
import com.xadazhii.server.repository.TestRepository;
import com.xadazhii.server.repository.TestResultRepository;
import com.xadazhii.server.repository.UserRepository;
import com.xadazhii.server.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class GradesController {

        @Autowired
        private UserRepository userRepository;
        @Autowired
        private TestRepository testRepository;
        @Autowired
        private TestResultRepository testResultRepository;
        @Autowired
        private com.xadazhii.server.repository.UserProgressRepository userProgressRepository;

        @GetMapping("/leaderboard")
        @PreAuthorize("isAuthenticated()")
        @Transactional(readOnly = true)
        public ResponseEntity<List<Map<String, Object>>> getLeaderboard() {
                UserDetailsImpl currentUser = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                                .getPrincipal();
                Long currentUserId = currentUser.getId();

                List<TestResult> allResults = testResultRepository.findAll();

                // 1. Calculate Test Points
                // 1. Calculate Test Points (Max score per test, sum of maxes)
                // Correct logic for test points (Max per test, then Sum):
                Map<Long, Map<Long, Integer>> bestTestScores = allResults.stream()
                                .filter(result -> result.getStudent() != null)
                                .collect(Collectors.groupingBy(
                                                result -> result.getStudent().getId(),
                                                Collectors.toMap(
                                                                result -> result.getTest().getId(),
                                                                TestResult::getScore,
                                                                Math::max)));

                // 2. Calculate Learning Points (Lectures: 2 pts, Seminars: 3 pts)
                List<Object[]> learningCounts = userProgressRepository.countCompletedLearningMaterialsByUserAndType();
                Map<Long, Integer> learningPointsByUser = new java.util.HashMap<>();

                for (Object[] row : learningCounts) {
                        Long userId = (Long) row[0];
                        String type = (String) row[1];
                        long count = (Long) row[2];

                        int points = 0;
                        if ("lecture".equalsIgnoreCase(type)) {
                                points = (int) count * 2;
                        } else if ("seminar".equalsIgnoreCase(type)) {
                                points = (int) count * 3;
                        }

                        learningPointsByUser.put(userId, learningPointsByUser.getOrDefault(userId, 0) + points);
                }

                // 3. Get all relevant User IDs
                java.util.Set<Long> allUserIds = new java.util.HashSet<>();
                allUserIds.addAll(bestTestScores.keySet());
                allUserIds.addAll(learningPointsByUser.keySet());

                List<Map<String, Object>> leaderboard = allUserIds.stream()
                                .map(userId -> {
                                        // Calculate total points
                                        Map<Long, Integer> userTestScores = bestTestScores.getOrDefault(userId,
                                                        java.util.Collections.emptyMap());
                                        int testTotal = userTestScores.values().stream().mapToInt(Integer::intValue)
                                                        .sum();
                                        int learningTotal = learningPointsByUser.getOrDefault(userId, 0);
                                        int totalPoints = testTotal + learningTotal;

                                        User user = userRepository.findById(java.util.Objects.requireNonNull(userId))
                                                        .orElse(null);
                                        if (user == null)
                                                return null;

                                        Map<String, Object> map = new java.util.HashMap<>();
                                        boolean isMe = userId.equals(currentUserId);

                                        if (isMe) {
                                                map.put("username", user.getUsername() + " (Vy)");
                                                map.put("isCurrentUser", true);
                                        } else {
                                                String maskedName = "Študent " + userId;
                                                if (user.getUsername() != null && !user.getUsername().isEmpty()) {
                                                        String[] parts = user.getUsername().split(" ");
                                                        if (parts.length > 0) {
                                                                maskedName = parts[0];
                                                                if (maskedName.length() > 3) {
                                                                        maskedName = maskedName.substring(0, 3) + "***";
                                                                } else {
                                                                        maskedName = maskedName + "***";
                                                                }
                                                        }
                                                }
                                                map.put("username", maskedName);
                                                map.put("isCurrentUser", false);
                                        }
                                        map.put("points", totalPoints);
                                        map.put("testPoints", testTotal);
                                        map.put("learningPoints", learningTotal);
                                        return map;
                                })
                                .filter(java.util.Objects::nonNull)
                                .sorted((a, b) -> ((Integer) b.get("points")).compareTo((Integer) a.get("points")))
                                .collect(Collectors.toList());

                return ResponseEntity.ok(leaderboard);
        }

        @GetMapping("/grades/summary")
        @PreAuthorize("hasRole('ADMIN')")
        @Transactional(readOnly = true)
        public ResponseEntity<GradesSummaryResponse> getGradesSummary() {
                List<Test> allTests = testRepository.findAll();
                List<User> allStudents = userRepository.findAll();
                List<TestResult> allResults = testResultRepository.findAll();

                Map<Long, Map<Long, Integer>> scoresByStudent = allResults.stream()
                                .collect(Collectors.groupingBy(
                                                result -> result.getStudent().getId(),
                                                Collectors.toMap(
                                                                result -> result.getTest().getId(),
                                                                TestResult::getScore,
                                                                (existingScore, newScore) -> Math.max(existingScore,
                                                                                newScore))));

                List<GradeTestInfo> testInfos = allTests.stream()
                                .map(test -> {
                                        int maxScore = test.getQuestions().stream()
                                                        .mapToInt(question -> question.getAnswers().stream()
                                                                        .mapToInt(Answer::getPointsWeight)
                                                                        .max()
                                                                        .orElse(0))
                                                        .sum();
                                        return new GradeTestInfo(test.getId(), test.getTitle(), maxScore);
                                })
                                .collect(Collectors.toList());

                List<StudentGradeInfo> studentGrades = allStudents.stream()
                                .map(student -> new StudentGradeInfo(
                                                student.getId(),
                                                student.getUsername(),
                                                student.getEmail(),
                                                scoresByStudent.getOrDefault(student.getId(),
                                                                java.util.Collections.emptyMap())))
                                .collect(Collectors.toList());

                GradesSummaryResponse response = new GradesSummaryResponse(testInfos, studentGrades);
                return ResponseEntity.ok(response);
        }

        @PreAuthorize("hasRole('ADMIN')")
        @GetMapping("/export/students")
        public ResponseEntity<byte[]> exportGrades() {
                try {
                        System.out.println("Exporting students to CSV...");
                        List<TestResult> allResults = testResultRepository.findAll();

                        StringBuilder csv = new StringBuilder();
                        csv.append('\ufeff'); // BOM
                        csv.append("E-mail;Názov testu;Dosiahnuté body\n");

                        for (TestResult result : allResults) {
                                String email = (result.getStudent() != null) ? result.getStudent().getEmail() : "N/A";
                                String testTitle = (result.getTest() != null) ? result.getTest().getTitle() : "N/A";
                                int score = result.getScore();

                                csv.append(email).append(";")
                                                .append(testTitle).append(";")
                                                .append(score).append("\n");
                        }

                        byte[] output = csv.toString().getBytes(StandardCharsets.UTF_8);

                        return ResponseEntity.ok()
                                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=results.csv")
                                        .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                                        .body(output);
                } catch (Exception e) {
                        System.err.println("Export failed: " + e.getMessage());
                        return ResponseEntity.internalServerError().build();
                }
        }
}