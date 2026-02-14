package com.xadazhii.server.controllers;

import com.xadazhii.server.models.*;
import com.xadazhii.server.payload.response.GradeTestInfo;
import com.xadazhii.server.payload.response.GradesSummaryResponse;
import com.xadazhii.server.payload.response.StudentGradeInfo;
import com.xadazhii.server.repository.TestRepository;
import com.xadazhii.server.repository.TestResultRepository;
import com.xadazhii.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "https://btsss-stu-fei.netlify.app", maxAge = 3600)
@RestController
@RequestMapping("/api/grades")
public class GradesController {

    @Autowired private UserRepository userRepository;
    @Autowired private TestRepository testRepository;
    @Autowired private TestResultRepository testResultRepository;

    @GetMapping("/summary")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public ResponseEntity<GradesSummaryResponse> getGradesSummary() {
        List<Test> allTests = testRepository.findAll();
        List<User> allStudents = userRepository.findAll();
        List<TestResult> allResults = testResultRepository.findAll();

        Map<Long, Map<Long, Integer>> scoresByStudent = allResults.stream()
                .collect(Collectors.groupingBy(
                        result -> result.getStudent().getId(),
                        Collectors.toMap(
                                result -> result.getTest().getId(),
                                TestResult::getScore,
                                (existingScore, newScore) -> Math.max(existingScore, newScore)
                        )
                ));

        List<GradeTestInfo> testInfos = allTests.stream()
                .map(test -> {
                    int maxScore = test.getQuestions().stream()
                            .mapToInt(question -> question.getAnswers().stream()
                                    .mapToInt(Answer::getPointsWeight)
                                    .max()
                                    .orElse(0))
                            .sum();
                    return new GradeTestInfo(test.getId(), test.getTitle(), maxScore);
                })
                .collect(Collectors.toList());

        List<StudentGradeInfo> studentGrades = allStudents.stream()
                .map(student -> new StudentGradeInfo(
                        student.getId(),
                        student.getUsername(),
                        student.getEmail(),
                        scoresByStudent.getOrDefault(student.getId(), java.util.Collections.emptyMap())
                ))
                .collect(Collectors.toList());

        GradesSummaryResponse response = new GradesSummaryResponse(testInfos, studentGrades);
        return ResponseEntity.ok(response);
    }
}