package com.xadazhii.server.services;

import com.xadazhii.server.models.GlobalSettings;
import com.xadazhii.server.models.Material;
import com.xadazhii.server.repository.GlobalSettingsRepository;
import com.xadazhii.server.repository.MaterialRepository;
import com.xadazhii.server.repository.UserProgressRepository;
import com.xadazhii.server.storage.FileStorageStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class MaterialService {

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private FileStorageStrategy fileStorage;

    @Autowired
    private GlobalSettingsRepository globalSettingsRepository;

    @Autowired
    private UserProgressRepository userProgressRepository;

    public int getCurrentWeek() {
        GlobalSettings settings = globalSettingsRepository.findAll().stream().findFirst().orElse(null);
        if (settings == null || settings.getSemesterStartDate() == null) {
            return 0;
        }

        ZoneId zone = ZoneId.of("Europe/Bratislava");
        ZonedDateTime start = settings.getSemesterStartDate().atZone(zone);
        ZonedDateTime now = ZonedDateTime.now(zone);

        if (now.isBefore(start)) {
            return -1;
        }

        long days = Duration.between(start, now).toDays();
        int week = (int) (days / 7) + 1;
        return Math.min(week, 14);
    }

    public List<Map<String, Object>> getAllMaterials(boolean isAdmin, boolean all) {
        int currentWeek = getCurrentWeek();
        List<Material> materials = materialRepository.findAll();

        if (!(all && isAdmin)) {
            materials = materials.stream()
                    .filter(m -> currentWeek >= 0 && m.getWeekNumber() != null && m.getWeekNumber() <= currentWeek)
                    .collect(Collectors.toList());
        }

        return materials.stream().map(material -> {
            Map<String, Object> materialMap = new HashMap<>();
            materialMap.put("id", material.getId());
            materialMap.put("title", material.getTitle());
            materialMap.put("type", material.getType());
            materialMap.put("url", material.getFilePath());
            materialMap.put("weekNumber", material.getWeekNumber());
            return materialMap;
        }).collect(Collectors.toList());
    }

    public Material addMaterial(String title, String type, Integer weekNumber, MultipartFile file) {
        String fileRef = fileStorage.store(file);
        Material material = new Material();
        material.setTitle(title);
        material.setType(type);
        material.setWeekNumber(weekNumber != null ? weekNumber : 0);
        material.setFilePath(fileRef);
        return materialRepository.save(material);
    }

    public void deleteMaterial(Long id) {
        Material material = materialRepository.findById(java.util.Objects.requireNonNull(id))
                .orElseThrow(() -> new NoSuchElementException("Materiál s id " + id + " nebol nájdený"));
        userProgressRepository.deleteByMaterialId(id);
        if (material.getFilePath() != null) {
            fileStorage.delete(material.getFilePath());
        }
        materialRepository.delete(material);
    }

    public Material updateMaterial(Long id, String title, Integer weekNumber, MultipartFile file) {
        Material material = materialRepository.findById(java.util.Objects.requireNonNull(id))
                .orElseThrow(() -> new NoSuchElementException("Materiál s id " + id + " nebol nájdený"));

        if (title != null) material.setTitle(title);
        if (weekNumber != null) material.setWeekNumber(weekNumber);

        if (file != null && !file.isEmpty()) {
            if (material.getFilePath() != null) {
                fileStorage.delete(material.getFilePath());
            }
            material.setFilePath(fileStorage.store(file));
        }

        return materialRepository.save(java.util.Objects.requireNonNull(material));
    }
}
