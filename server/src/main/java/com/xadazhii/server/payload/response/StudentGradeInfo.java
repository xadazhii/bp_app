package com.xadazhii.server.payload.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.Map;

@Getter
@AllArgsConstructor
public class StudentGradeInfo {
    private Long id;
    private String username;
    private String email;
    private Map<Long, Integer> scores;
    private Map<Long, Boolean> cheatedMap;
    private Map<Long, Long> resultIds;
    private Map<Long, Integer> maxScores;
}