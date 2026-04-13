package com.xadazhii.server.repository;

import com.xadazhii.server.models.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    List<TestResult> findByStudentId(Long studentId);

    List<TestResult> findByTestId(Long testId);

    @Modifying
    @Transactional
    void deleteByTestId(Long testId);

    @Modifying
    @Transactional
    void deleteByStudentId(Long studentId);

    @org.springframework.data.jpa.repository.Query("SELECT r FROM TestResult r LEFT JOIN FETCH r.submittedAnswers sa LEFT JOIN FETCH sa.question WHERE r.test.id IN (SELECT t.id FROM Test t)")
    List<TestResult> findAllWithAnswersAndQuestions();

    boolean existsByTestId(Long testId);

    boolean existsByStudentIdAndTestId(Long studentId, Long testId);
}