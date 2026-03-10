package com.xadazhii.server.controllers;

import com.xadazhii.server.config.CloudinaryConfig;
import com.xadazhii.server.models.Material;
import com.xadazhii.server.payload.response.MessageResponse;
import com.xadazhii.server.repository.MaterialRepository;
import com.xadazhii.server.repository.UserProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;
import com.xadazhii.server.models.GlobalSettings;
import com.xadazhii.server.repository.GlobalSettingsRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@CrossOrigin(origins = "https://btsss-stu-fei.netlify.app", maxAge = 3600)
@RestController
@RequestMapping("/api/materials")
public class MaterialController {

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private CloudinaryConfig cloudinaryService;

    @Autowired
    private UserProgressRepository userProgressRepository;

    @Autowired
    private GlobalSettingsRepository globalSettingsRepository;

    private int getCurrentWeek() {
        GlobalSettings settings = globalSettingsRepository.findById(1L).orElse(null);
        if (settings == null || settings.getSemesterStartDate() == null) {
            return 0; // default to 0 if no date is set
        }
        java.time.LocalDateTime start = settings.getSemesterStartDate();

        java.util.TimeZone tz = java.util.TimeZone.getTimeZone("Europe/Bratislava");
        java.time.LocalDateTime now = java.time.LocalDateTime.now(tz.toZoneId());

        if (now.isBefore(start)) {
            return 0;
        }
        return (int) java.time.temporal.ChronoUnit.MINUTES.between(start, now) + 1;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Map<String, Object>>> getAllMaterials(
            @RequestParam(value = "all", required = false, defaultValue = "false") boolean all) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_MODERATOR"));

        int currentWeek = getCurrentWeek();

        List<Material> materials = materialRepository.findAll();

        if (!(all && isAdmin)) {
            materials = materials.stream()
                    .filter(m -> m.getWeekNumber() != null && m.getWeekNumber() <= currentWeek)
                    .collect(Collectors.toList());
        }

        List<Map<String, Object>> responseList = materials.stream().map(material -> {
            Map<String, Object> materialMap = new HashMap<>();
            materialMap.put("id", material.getId());
            materialMap.put("title", material.getTitle());
            materialMap.put("type", material.getType());
            materialMap.put("url", material.getFilePath());
            materialMap.put("weekNumber", material.getWeekNumber());
            return materialMap;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(responseList);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    @Transactional
    public ResponseEntity<MessageResponse> addMaterial(@RequestParam("title") String title,
            @RequestParam("type") String type,
            @RequestParam(value = "weekNumber", required = false, defaultValue = "0") Integer weekNumber,
            @RequestParam("file") MultipartFile file) {
        String fileUrl = cloudinaryService.store(file);

        Material material = new Material();
        material.setTitle(title);
        material.setType(type);
        material.setFilePath(fileUrl);
        material.setWeekNumber(weekNumber != null ? weekNumber : 0);

        materialRepository.save(material);

        return ResponseEntity.ok(new MessageResponse("Materiál bol úспешне доданий!"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    @Transactional
    public ResponseEntity<MessageResponse> deleteMaterial(@PathVariable Long id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Chyba: Materiál s id " + id + " sa nenašiel."));

        // Delete student progress associated with this material
        userProgressRepository.deleteByMaterialId(id);

        String fileUrl = material.getFilePath();

        cloudinaryService.delete(fileUrl);

        materialRepository.deleteById(id);

        return ResponseEntity.ok(new MessageResponse("Materiál bol úспешне видалений!"));
    }
}