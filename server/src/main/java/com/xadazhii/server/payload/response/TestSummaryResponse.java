package com.xadazhii.server.payload.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TestSummaryResponse {
    private Long id;
    private String title;
    private int questionCount;
    private int totalPoints;
    private Integer weekNumber;
    private java.time.LocalDateTime examDateTime;
    private Integer timeLimit;
    private boolean available;
}
