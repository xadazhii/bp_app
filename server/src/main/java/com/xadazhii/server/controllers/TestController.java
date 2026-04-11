package com.xadazhii.server.controllers;

import com.xadazhii.server.payload.request.TestRequest;
import com.xadazhii.server.payload.request.TestResultRequest;
import com.xadazhii.server.payload.response.MessageResponse;
import com.xadazhii.server.payload.response.TestSummaryResponse;
import com.xadazhii.server.security.details.UserDetailsImpl;
import com.xadazhii.server.services.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tests")
public class TestController {

    @Autowired
    private TestService testService;

    @Autowired
    private com.xadazhii.server.repository.TestResultRepository testResultRepository;

    @GetMapping
    public List<TestSummaryResponse> getTests(@RequestParam(value = "all", defaultValue = "false") boolean all) {
        org.springframework.security.core.Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (auth != null && auth.getPrincipal() instanceof UserDetailsImpl) ? ((UserDetailsImpl) auth.getPrincipal()).getId() : null;
        return testService.getTests(all, userId);
    }

    @GetMapping("/all")
    public List<TestSummaryResponse> getAllTests() {
        return getTests(true);
    }

    @GetMapping("/available")
    @PreAuthorize("isAuthenticated()")
    public List<TestSummaryResponse> getAvailableTests() {
        return getTests(false);
    }

    @PostMapping("/import")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> importTestFromFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "type", defaultValue = "WEEKLY") String type,
            @RequestParam(value = "weekNumber", defaultValue = "0") Integer weekNumber) {
        try {
            int count = testService.importFromFile(file, type, weekNumber);
            return ResponseEntity.ok(new MessageResponse("Úspešne importované " + count + " testy!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Chyba pri importe: " + e.getMessage());
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createTest(@RequestBody TestRequest testRequest) {
        return ResponseEntity.ok(testService.createTest(testRequest));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTest(@PathVariable @lombok.NonNull Long id) {
        try {
            testService.deleteTest(id);
            return ResponseEntity.ok("Test bol úspešne odstránený!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Chyba pri odstraňovaní testu: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateTest(@PathVariable @lombok.NonNull Long id, @RequestBody TestRequest testRequest) {
        try {
            return ResponseEntity.ok(testService.updateTest(id, testRequest));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Chyba pri úprave testu: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getTest(@PathVariable @lombok.NonNull Long id, @RequestParam(defaultValue = "false") boolean full) {
        org.springframework.security.core.Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (auth != null && auth.getPrincipal() instanceof UserDetailsImpl) ? ((UserDetailsImpl) auth.getPrincipal()).getId() : null;
        return ResponseEntity.ok(testService.getTestDetail(id, full, userId));
    }

    @GetMapping("/completed")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Set<Long>> getCompletedTestIds() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Set<Long> completedIds = testResultRepository.findByStudentId(userDetails.getId()).stream()
                .map(tr -> tr.getTest().getId()).collect(Collectors.toSet());
        return ResponseEntity.ok(completedIds);
    }

    @PostMapping("/results")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> saveTestResult(@RequestBody @lombok.NonNull TestResultRequest request) {
        try {
            return ResponseEntity.ok(testService.saveTestResult(request));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Interná chyba: " + e.getMessage());
        }
    }

    @GetMapping("/results/{resultId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getTestResultDetails(@PathVariable @lombok.NonNull Long resultId) {
        return ResponseEntity.ok(testService.getTestResultDetails(resultId));
    }

    @PostMapping("/results/evaluate-answer")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> evaluateAnswer(@RequestBody @lombok.NonNull Map<String, Object> payload) {
        try {
            testService.evaluateAnswer(payload);
            return ResponseEntity.ok(new MessageResponse("Odpoveď bola úspešne prehodnotená!"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Chyba: " + e.getMessage());
        }
    }

    @PostMapping("/results/{resultId}/toggle-cheat")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleCheatStatus(@PathVariable @lombok.NonNull Long resultId) {
        try {
            testService.toggleCheatStatus(resultId);
            return ResponseEntity.ok(new MessageResponse("Status podvádzania bol úspešne zmenený!"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Chyba: " + e.getMessage());
        }
    }

    @DeleteMapping("/results/{resultId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTestResult(@PathVariable @lombok.NonNull Long resultId) {
        try {
            testService.deleteTestResult(resultId);
            return ResponseEntity.ok(new MessageResponse("Test bol úspešne vynulovaný."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Chyba: " + e.getMessage());
        }
    }
}