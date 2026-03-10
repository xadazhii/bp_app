package com.xadazhii.server.controllers;

import com.xadazhii.server.models.GlobalSettings;
import com.xadazhii.server.repository.GlobalSettingsRepository;
import com.xadazhii.server.repository.TestResultRepository;
import com.xadazhii.server.repository.UserProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;

@CrossOrigin(origins = { "https://btsss-stu-fei.netlify.app", "http://localhost:3000" }, maxAge = 3600)
@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    @Autowired
    private GlobalSettingsRepository settingsRepository;

    @Autowired
    private TestResultRepository testResultRepository;

    @Autowired
    private UserProgressRepository userProgressRepository;

    @Value("${app.admin.email}")
    private String adminEmail;

    @GetMapping("/semester-start")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getSemesterStart() {
        GlobalSettings settings = settingsRepository.findById(1L).orElse(null);
        return ResponseEntity.ok(Map.of(
                "semesterStartDate",
                settings != null && settings.getSemesterStartDate() != null
                        ? settings.getSemesterStartDate().toLocalDate().toString()
                        : "",
                "adminEmail", adminEmail != null ? adminEmail : ""));
    }

    @PostMapping("/semester-start")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> setSemesterStart(@RequestBody Map<String, String> payload) {
        GlobalSettings settings = settingsRepository.findById(1L).orElse(new GlobalSettings());
        settings.setId(1L);
        if (payload.containsKey("semesterStartDate") && payload.get("semesterStartDate") != null
                && !payload.get("semesterStartDate").isEmpty()) {
            LocalDate parsedDate = LocalDate.parse(payload.get("semesterStartDate"));
            ZoneId bratislavaZone = ZoneId.of("Europe/Bratislava");
            if (parsedDate.equals(LocalDate.now(bratislavaZone))) {
                settings.setSemesterStartDate(ZonedDateTime.now(bratislavaZone).toLocalDateTime());
            } else {
                settings.setSemesterStartDate(parsedDate.atStartOfDay());
            }
        } else {
            settings.setSemesterStartDate(null);
        }
        settingsRepository.save(settings);

        // Reset all students' results and progress
        testResultRepository.deleteAll();
        userProgressRepository.deleteAll();

        return ResponseEntity
                .ok(Map.of("message", "Dátum začiatku semestra bol aktualizovaný a všetky výsledky boli resetované!"));
    }
}
