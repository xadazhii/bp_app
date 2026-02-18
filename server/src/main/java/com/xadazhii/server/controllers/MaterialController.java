package com.xadazhii.server.controllers;

import com.xadazhii.server.models.Material;
import com.xadazhii.server.payload.response.MessageResponse;
import com.xadazhii.server.repository.MaterialRepository;
import com.xadazhii.server.security.services.FileStorageService;
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

@CrossOrigin(origins = {"https://btsss-stu-fei.netlify.app", "http://localhost:3000"}, maxAge = 3600)
@RestController
@RequestMapping("/api/materials")
public class MaterialController {

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Map<String, Object>>> getAllMaterials() {
        List<Material> materials = materialRepository.findAll();

        List<Map<String, Object>> responseList = materials.stream().map(material -> {
            Map<String, Object> materialMap = new HashMap<>();
            materialMap.put("id", material.getId());
            materialMap.put("title", material.getTitle());
            materialMap.put("type", material.getType());
            materialMap.put("url", material.getFilePath());
            return materialMap;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(responseList);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    @Transactional
    public ResponseEntity<MessageResponse> addMaterial(@RequestParam("title") String title,
            @RequestParam("type") String type,
            @RequestParam("file") MultipartFile file) {
        String storedFilename = fileStorageService.store(file);

        Material material = new Material();
        material.setTitle(title);
        material.setType(type);
        material.setFilePath(storedFilename);
        materialRepository.save(material);

        return ResponseEntity.ok(new MessageResponse("Materiál bol úspešne pridaný!"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    @Transactional
    public ResponseEntity<MessageResponse> deleteMaterial(@PathVariable Long id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Chyba: Materiál s id " + id + " sa nenašiel."));

        String fileName = material.getFilePath();

        fileStorageService.delete(fileName);

        materialRepository.deleteById(id);

        return ResponseEntity.ok(new MessageResponse("Materiál bol úspešne vymazaný!"));
    }
}
