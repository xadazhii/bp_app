package com.xadazhii.server.controllers;

import com.xadazhii.server.models.Answer;
import com.xadazhii.server.models.TestResult;
import com.xadazhii.server.models.User;
import com.xadazhii.server.models.UserProgress;
import com.xadazhii.server.models.Material;
import com.xadazhii.server.payload.request.ProgressRequest;
import com.xadazhii.server.payload.request.TestSubmitRequest;
import com.xadazhii.server.payload.response.MessageResponse;
import com.xadazhii.server.payload.response.UserStatsResponse;
import com.xadazhii.server.repository.TestResultRepository;
import com.xadazhii.server.repository.UserRepository;
import com.xadazhii.server.repository.MaterialRepository;
import com.xadazhii.server.repository.UserProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = {"https://btsss-stu-fei.netlify.app", "http://localhost:3000"}, maxAge = 3600)
@RestController
@RequestMapping("/api")
public class ProgressController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private UserProgressRepository userProgressRepository;

    @Autowired
    private TestResultRepository testResultRepository;

    @GetMapping("/progress/completed-ids")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Set<Long>> getCompletedMaterialIds() {
        User currentUser = getCurrentUser();
        Set<Long> completedIds = userProgressRepository.findCompletedMaterialIdsByUserId(currentUser.getId());
        return ResponseEntity.ok(completedIds);
    }

    @PostMapping("/progress")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> markAsCompleted(@Valid @RequestBody ProgressRequest progressRequest) {
        User currentUser = getCurrentUser();

        if (userProgressRepository.existsByUserIdAndMaterialId(currentUser.getId(), progressRequest.getMaterialId())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Chyba: Tento materiál už bol označený ako dokončený!"));
        }

        Material material = materialRepository.findById(progressRequest.getMaterialId())
                .orElseThrow(() -> new RuntimeException("Chyba: Materiál nebol nájdený."));

        UserProgress progress = new UserProgress(currentUser, material);
        userProgressRepository.save(progress);

        return ResponseEntity.ok(new MessageResponse("Materiál bol úspešne označený ako dokončený!"));
    }

    @PostMapping("/tests/submit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> submitTest(@Valid @RequestBody TestSubmitRequest testRequest) {
        User currentUser = getCurrentUser();

        Material material = materialRepository.findById(testRequest.getMaterialId())
                .orElseThrow(() -> new RuntimeException("Chyba: Test nebol nájdený."));

        UserProgress progress = new UserProgress(currentUser, material, testRequest.getScore());
        userProgressRepository.save(progress);

        currentUser.setPoints(currentUser.getPoints() + testRequest.getScore());
        userRepository.save(currentUser);

        return ResponseEntity.ok(new MessageResponse("Výsledky testu boli úspešne uložené!"));
    }

    @GetMapping("/users/{userId}/stats")
    @PreAuthorize("isAuthenticated()")
    @Transactional(readOnly = true)
    public ResponseEntity<UserStatsResponse> getUserStats(@PathVariable Long userId) {
        long totalLectures = materialRepository.countByMaterialType("lecture");
        long completedLectures = userProgressRepository.countCompletedByUserAndType(userId, "lecture");
        int percentLectures = (totalLectures == 0) ? 0
                : (int) Math.round(((double) completedLectures / totalLectures) * 100);
        UserStatsResponse.StatsDetail lectureStats = new UserStatsResponse.StatsDetail(completedLectures, totalLectures,
                percentLectures);

        long totalSeminars = materialRepository.countByMaterialType("seminar");
        long completedSeminars = userProgressRepository.countCompletedByUserAndType(userId, "seminar");
        int percentSeminars = (totalSeminars == 0) ? 0
                : (int) Math.round(((double) completedSeminars / totalSeminars) * 100);
        UserStatsResponse.StatsDetail seminarStats = new UserStatsResponse.StatsDetail(completedSeminars, totalSeminars,
                percentSeminars);

        List<TestResult> userTestResults = testResultRepository.findByStudentId(userId);

        List<UserStatsResponse.UserTestResultDto> detailedResults = userTestResults.stream().map(result -> {

            int maxScore = result.getTest().getQuestions().stream()
                    .mapToInt(question -> question.getAnswers().stream()
                            .mapToInt(Answer::getPointsWeight)
                            .max()
                            .orElse(0))
                    .sum();

            return new UserStatsResponse.UserTestResultDto(
                    result.getTest().getTitle(),
                    result.getScore(),
                    maxScore);
        }).collect(Collectors.toList());

        int totalPoints = detailedResults.stream()
                .mapToInt(UserStatsResponse.UserTestResultDto::getScore)
                .sum();

        long completedTests = userTestResults.size();

        UserStatsResponse.TestStatsDetail testStats = new UserStatsResponse.TestStatsDetail(totalPoints, completedTests,
                detailedResults);

        UserStatsResponse response = new UserStatsResponse(lectureStats, seminarStats, testStats);
        return ResponseEntity.ok(response);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserName = authentication.getName();
        return userRepository.findByUsername(currentUserName)
                .orElseThrow(() -> new UsernameNotFoundException("Používateľ " + currentUserName + " nebol nájdený"));
    }
}