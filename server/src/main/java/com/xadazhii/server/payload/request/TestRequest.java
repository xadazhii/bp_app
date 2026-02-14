package com.xadazhii.server.payload.request;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Setter
@Getter
public class TestRequest {
    private String title;
    private List<QuestionDTO> questions;

    @Setter
    @Getter
    public static class QuestionDTO {
        private String question;
        private String type;
        private int points;
        private List<AnswerDTO> answers;
    }

    @Setter
    @Getter
    public static class AnswerDTO {
        private String text;
        private int pointsWeight;
    }
}