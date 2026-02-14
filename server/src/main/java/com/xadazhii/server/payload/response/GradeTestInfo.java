package com.xadazhii.server.payload.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GradeTestInfo {
    private Long id;
    private String title;
    private int maxScore;
}