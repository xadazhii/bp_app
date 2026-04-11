package com.xadazhii.server.controllers;

import com.xadazhii.server.models.Material;
import com.xadazhii.server.payload.response.MessageResponse;
import com.xadazhii.server.services.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/materials")
public class MaterialController {

    @Autowired
    private MaterialService materialService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Map<String, Object>>> getAllMaterials(
            @RequestParam(value = "all", required = false, defaultValue = "false") boolean all) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        return ResponseEntity.ok(materialService.getAllMaterials(isAdmin, all));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> addMaterial(@RequestParam("title") String title,
            @RequestParam("type") String type,
            @RequestParam(value = "weekNumber", required = false, defaultValue = "0") Integer weekNumber,
            @RequestParam("file") MultipartFile file) {

        materialService.addMaterial(title, type, weekNumber, file);
        return ResponseEntity.ok(new MessageResponse("Materiál bol úspešne pridaný!"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteMaterial(@PathVariable @lombok.NonNull Long id) {
        try {
            materialService.deleteMaterial(id);
            return ResponseEntity.ok(new MessageResponse("Materiál bol úspešne vymazaný!"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new MessageResponse("Chyba: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateMaterial(@PathVariable @lombok.NonNull Long id,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "weekNumber", required = false) Integer weekNumber,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            Material material = materialService.updateMaterial(id, title, weekNumber, file);
            return ResponseEntity.ok(material);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new MessageResponse("Chyba pri aktualizácii: " + e.getMessage()));
        }
    }
}