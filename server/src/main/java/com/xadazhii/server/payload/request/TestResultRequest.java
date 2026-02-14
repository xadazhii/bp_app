package com.xadazhii.server.payload.request;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Setter
@Getter
public class TestResultRequest {
    private Long studentId;
    private Long testId;
    private int score;
    private List<AnswerSubmission> submissions;

    @Setter
    @Getter
    public static class AnswerSubmission {
        private Long questionId;

        private Long answerId;

        private String textResponse;
    }
}