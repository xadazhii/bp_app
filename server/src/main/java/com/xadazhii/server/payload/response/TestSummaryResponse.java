package com.xadazhii.server.payload.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TestSummaryResponse {
    private Long id;
    private String title;
    private int questionCount;
    private int totalPoints;
}