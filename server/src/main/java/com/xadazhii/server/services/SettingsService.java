package com.xadazhii.server.services;

import com.xadazhii.server.models.GlobalSettings;
import com.xadazhii.server.repository.GlobalSettingsRepository;
import com.xadazhii.server.repository.TestResultRepository;
import com.xadazhii.server.repository.UserProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class SettingsService {

    @Autowired
    private GlobalSettingsRepository settingsRepository;

    @Autowired
    private TestResultRepository testResultRepository;

    @Autowired
    private UserProgressRepository userProgressRepository;

    @Value("${app.admin.email}")
    private String adminEmail;

    public Map<String, String> getSemesterStart() {
        GlobalSettings settings = settingsRepository.findById(1L).orElse(null);
        Map<String, String> resp = new HashMap<>();
        if (settings != null && settings.getSemesterStartDate() != null) {

            ZonedDateTime startUtc = settings.getSemesterStartDate().atZone(ZoneOffset.UTC);
            resp.put("semesterStartDate", startUtc.toInstant().toString());
        } else {
            resp.put("semesterStartDate", "");
        }
        resp.put("adminEmail", adminEmail != null ? adminEmail : "");
        return resp;
    }

    @Transactional
    public void setSemesterStart(String dateStr) {
        GlobalSettings settings = settingsRepository.findById(1L).orElse(new GlobalSettings());
        settings.setId(1L);

        if (dateStr != null && !dateStr.isEmpty()) {
            ZoneId bratislavaZone = ZoneId.of("Europe/Bratislava");

            String datePart = dateStr.split("T")[0];
            LocalDate parsedDate = LocalDate.parse(datePart);
            LocalDate today = LocalDate.now(bratislavaZone);

            LocalDateTime utcEquivalent;
            if (parsedDate.equals(today)) {

                ZonedDateTime nowInBratislava = ZonedDateTime.now(bratislavaZone).withSecond(0).withNano(0);
                utcEquivalent = nowInBratislava.withZoneSameInstant(ZoneOffset.UTC).toLocalDateTime();
            } else {

                ZonedDateTime midnightBratislava = parsedDate.atStartOfDay(bratislavaZone);
                utcEquivalent = midnightBratislava.withZoneSameInstant(ZoneOffset.UTC).toLocalDateTime();
            }
            settings.setSemesterStartDate(utcEquivalent);
        } else {
            settings.setSemesterStartDate(null);
        }

        settingsRepository.save(settings);
        testResultRepository.deleteAll();
        userProgressRepository.deleteAll();
    }
}