package com.xadazhii.server.controllers;

import com.xadazhii.server.models.TestResult;
import com.xadazhii.server.repository.TestResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "https://btsss-stu-fei.netlify.app", maxAge = 3600)
@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private TestResultRepository testResultRepository;

    @GetMapping("/scores/{studentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TestResult>> getStudentScores(@PathVariable Long studentId) {
        List<TestResult> results = testResultRepository.findByStudentId(studentId);
        return ResponseEntity.ok(results);
    }
}