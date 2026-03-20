package com.xadazhii.server.controllers;

import com.xadazhii.server.payload.response.GradesSummaryResponse;
import com.xadazhii.server.security.details.UserDetailsImpl;
import com.xadazhii.server.services.GradesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class GradesController {

    @Autowired
    private GradesService gradesService;

    @GetMapping("/leaderboard")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Map<String, Object>>> getLeaderboard() {
        UserDetailsImpl current = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(gradesService.getLeaderboard(current.getId()));
    }

    @GetMapping("/grades/summary")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GradesSummaryResponse> getGradesSummary() {
        return ResponseEntity.ok(gradesService.getGradesSummary());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/export/students")
    public ResponseEntity<byte[]> exportGrades() {
        try {
            byte[] output = gradesService.exportGradesToCsv();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=results.csv")
                    .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                    .body(output);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
