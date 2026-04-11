package com.xadazhii.server.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import javax.persistence.*;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "student_answers")
public class StudentAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_result_id", nullable = false)
    private TestResult testResult;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "selected_answer_id", nullable = true)
    private Answer selectedAnswer;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "student_answer_selected_answers",
        joinColumns = @JoinColumn(name = "student_answer_id"),
        inverseJoinColumns = @JoinColumn(name = "answer_id")
    )
    private List<Answer> selectedAnswers = new java.util.ArrayList<>();

    @Column(name = "text_response", columnDefinition = "TEXT")
    private String textResponse;

    @Column(name = "is_correct", nullable = false)
    private boolean isCorrect;

    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "earned_points")
    private Integer earnedPoints;

}