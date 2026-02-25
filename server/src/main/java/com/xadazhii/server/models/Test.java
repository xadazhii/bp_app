package com.xadazhii.server.models;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "tests")
public class Test {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "week_number", nullable = false)
    private Integer weekNumber = 0;

    @Column(name = "exam_date_time")
    private LocalDateTime examDateTime;

    @Column(name = "time_limit_minutes")
    private Integer timeLimit;

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Question> questions = new ArrayList<>();

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<TestResult> testResults = new ArrayList<>();

    public void setQuestions(List<Question> questions) {
        this.questions.clear();

        if (questions != null) {
            for (Question q : questions) {
                addQuestion(q);
            }
        }
    }

    public void addQuestion(Question question) {
        this.questions.add(question);
        question.setTest(this);
    }

    public void removeQuestion(Question question) {
        this.questions.remove(question);
        question.setTest(null);
    }
}