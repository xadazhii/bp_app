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
@Table(name = "test_results")
public class TestResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_id", nullable = false)
    private Test test;

    @Column(name = "score", nullable = false)
    private int score;

    @Column(name = "completed_at", nullable = false)
    private LocalDateTime completedAt;

    @OneToMany(mappedBy = "testResult", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StudentAnswer> submittedAnswers = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (completedAt == null) {
            completedAt = LocalDateTime.now();
        }
    }
}