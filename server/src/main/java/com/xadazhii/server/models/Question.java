package com.xadazhii.server.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "type", nullable = false)
    private String type = "CLOSED";

    @Column(name = "points", nullable = false, columnDefinition = "INT DEFAULT 1")
    private int points;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_id", nullable = false)
    @JsonIgnore
    private Test test;

    @OneToMany(
            mappedBy = "question",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.EAGER
    )
    private List<Answer> answers = new ArrayList<>();

    public void setAnswers(List<Answer> answers) {
        for (Answer a : new ArrayList<>(this.answers)) {
            removeAnswer(a);
        }
        for (Answer a : answers) {
            addAnswer(a);
        }
    }

    public void addAnswer(Answer answer) {
        this.answers.add(answer);
        answer.setQuestion(this);
    }

    public void removeAnswer(Answer answer) {
        this.answers.remove(answer);
        answer.setQuestion(null);
    }
}