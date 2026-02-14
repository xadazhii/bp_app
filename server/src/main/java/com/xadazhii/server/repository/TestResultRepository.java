package com.xadazhii.server.repository;

import com.xadazhii.server.models.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    List<TestResult> findByStudentId(Long studentId);
    boolean existsByTestId(Long testId);
}