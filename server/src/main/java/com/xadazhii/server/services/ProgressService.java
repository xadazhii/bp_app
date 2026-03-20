package com.xadazhii.server.services;

import com.xadazhii.server.models.Material;
import com.xadazhii.server.models.Question;
import com.xadazhii.server.models.TestResult;
import com.xadazhii.server.models.User;
import com.xadazhii.server.models.UserProgress;
import com.xadazhii.server.payload.response.UserStatsResponse;
import com.xadazhii.server.repository.MaterialRepository;
import com.xadazhii.server.repository.TestResultRepository;
import com.xadazhii.server.repository.UserProgressRepository;
import com.xadazhii.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProgressService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private UserProgressRepository userProgressRepository;

    @Autowired
    private TestResultRepository testResultRepository;

    public Set<Long> getCompletedMaterialIds(Long userId) {
        return userProgressRepository.findCompletedMaterialIdsByUserId(userId);
    }

    public void markAsCompleted(Long userId, Long materialId) {
        if (userProgressRepository.existsByUserIdAndMaterialId(java.util.Objects.requireNonNull(userId), java.util.Objects.requireNonNull(materialId))) {
            throw new RuntimeException("Chyba: Tento materiál už bol označený ako dokončený!");
        }

        User user = userRepository.findById(java.util.Objects.requireNonNull(userId)).orElseThrow(() -> new RuntimeException("Používateľ nebol nájdený."));
        Material material = materialRepository.findById(java.util.Objects.requireNonNull(materialId)).orElseThrow(() -> new RuntimeException("Materiál nebol nájdený."));

        userProgressRepository.save(new UserProgress(java.util.Objects.requireNonNull(user), java.util.Objects.requireNonNull(material)));
    }

    @Transactional
    public void submitMaterialTest(Long userId, Long materialId, Integer score) {
        User user = userRepository.findById(java.util.Objects.requireNonNull(userId)).orElseThrow(() -> new RuntimeException("Používateľ nebol nájdený."));
        Material material = materialRepository.findById(java.util.Objects.requireNonNull(materialId)).orElseThrow(() -> new RuntimeException("Materiál nebol nájdený."));

        userProgressRepository.save(new UserProgress(user, material, java.util.Objects.requireNonNull(score)));
        user.setPoints((user.getPoints() != null ? user.getPoints() : 0) + score);
        userRepository.save(java.util.Objects.requireNonNull(user));
    }

    @Transactional(readOnly = true)
    public UserStatsResponse getUserStats(Long userId) {
        long totalLectures = materialRepository.countByMaterialType("lecture");
        long totalSeminars = materialRepository.countByMaterialType("seminar");
        long completedLectures = userProgressRepository.countCompletedByUserAndType(userId, "lecture");
        long completedSeminars = userProgressRepository.countCompletedByUserAndType(userId, "seminar");

        int lp = totalLectures > 0 ? (int) (completedLectures * 100 / totalLectures) : 0;
        int sp = totalSeminars > 0 ? (int) (completedSeminars * 100 / totalSeminars) : 0;

        UserStatsResponse.StatsDetail lectureStats = new UserStatsResponse.StatsDetail(completedLectures, totalLectures, lp);
        UserStatsResponse.StatsDetail seminarStats = new UserStatsResponse.StatsDetail(completedSeminars, totalSeminars, sp);

        List<TestResult> results = testResultRepository.findByStudentId(userId);
        int totalPoints = results.stream().mapToInt(TestResult::getScore).sum();
        List<UserStatsResponse.UserTestResultDto> detailed = results.stream().map(r -> {
            int maxScore;
            List<Question> questions = (r.getTest().getQuestions() != null) ? r.getTest().getQuestions() : Collections.emptyList();
            int limit = getQuestionLimit(r.getTest().getWeekNumber());

            if (limit > 0 && questions.size() > limit) {
                List<Question> shuffled = new ArrayList<>(questions);
                shuffled.sort(Comparator.comparing(Question::getId));
                Collections.shuffle(shuffled, new Random(Objects.hash(userId, r.getTest().getId())));
                maxScore = shuffled.subList(0, limit).stream().mapToInt(Question::getPoints).sum();
            } else {
                maxScore = questions.stream().mapToInt(Question::getPoints).sum();
            }

            return new UserStatsResponse.UserTestResultDto(
                r.getTest().getTitle(),
                r.getScore(),
                maxScore,
                r.getTest().getId(),
                r.getId(),
                r.isCheated(),
                r.getTest().getWeekNumber()
            );
        }).collect(Collectors.toList());

        UserStatsResponse.TestStatsDetail testStats = new UserStatsResponse.TestStatsDetail(totalPoints, results.size(), detailed);

        return new UserStatsResponse(lectureStats, seminarStats, testStats);
    }

    private int getQuestionLimit(Integer week) {
        if (week == null) return 0;
        if (week >= 1 && week <= 12) return 8;
        if (week == 14) return 25;
        return 0;
    }
}
