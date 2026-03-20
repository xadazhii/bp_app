package com.xadazhii.server.controllers;

import com.xadazhii.server.services.SettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    @Autowired
    private SettingsService settingsService;

    @GetMapping("/semester-start")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getSemesterStart() {
        return ResponseEntity.ok(settingsService.getSemesterStart());
    }

    @PostMapping("/semester-start")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> setSemesterStart(@RequestBody Map<String, String> payload) {
        settingsService.setSemesterStart(payload.get("semesterStartDate"));
        return ResponseEntity.ok(Map.of("message", "Dátum začiatku semestra bol aktualizovaný a všetky výsledky boli resetované!"));
    }
}
