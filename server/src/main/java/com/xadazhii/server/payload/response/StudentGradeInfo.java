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
}