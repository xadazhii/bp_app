package com.xadazhii.server.payload.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.List;

@Getter
@AllArgsConstructor
public class UserStatsResponse {
    private StatsDetail lectureStats;
    private StatsDetail seminarStats;
    private TestStatsDetail testStats;

    @Getter
    @AllArgsConstructor
    public static class UserTestResultDto {
        private String title;
        private int score;
        private int maxScore;
    }

    @Getter
    @AllArgsConstructor
    public static class TestStatsDetail {
        private int totalPoints;
        private long completedTests;
        private List<UserTestResultDto> detailedResults;
    }

    @Getter
    @AllArgsConstructor
    public static class StatsDetail {
        private long completed;
        private long total;
        private int percent;
    }
}