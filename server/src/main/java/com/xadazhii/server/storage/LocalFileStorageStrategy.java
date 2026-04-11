package com.xadazhii.server.storage;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "btsss.app.storage", havingValue = "local", matchIfMissing = true)
public class LocalFileStorageStrategy implements FileStorageStrategy {

    private final Path root = Paths.get("uploads");

    public LocalFileStorageStrategy() {
        try {
            if (!Files.exists(root)) {
                Files.createDirectories(root);
            }
        } catch (IOException e) {
            throw new RuntimeException("Nepodarilo sa inicializovať priečinok pre nahrávanie súborov!");
        }
    }

    @Override
    public String store(MultipartFile file) {
        try {
            String originalFilename = file.getOriginalFilename();
            String extension = "";

            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String uniqueFileName = UUID.randomUUID() + extension;
            Files.copy(file.getInputStream(), root.resolve(uniqueFileName));
            return uniqueFileName;
        } catch (Exception e) {
            throw new RuntimeException("Chyba pri ukladaní súboru: " + e.getMessage());
        }
    }

    @Override
    public void delete(String fileRef) {
        if (fileRef == null || fileRef.isEmpty() || fileRef.startsWith("http")) return;
        try {
            Files.deleteIfExists(root.resolve(fileRef));
        } catch (IOException e) {
            System.err.println("Chyba pri mazaní súboru: " + fileRef + ". " + e.getMessage());
        }
    }

    @Override
    public String getPublicUrl(String fileRef, String baseUrl) {
        if (fileRef == null) return null;
        if (fileRef.startsWith("http")) return fileRef;
        return baseUrl + "/uploads/" + fileRef;
    }
}