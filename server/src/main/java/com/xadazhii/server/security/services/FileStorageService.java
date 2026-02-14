package com.xadazhii.server.security.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {
    private final Path root = Paths.get("uploads");

    public FileStorageService() {
        try {
            if (!Files.exists(root)) {
                Files.createDirectories(root);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for upload!");
        }
    }

    public String store(MultipartFile file) {
        try {
            String originalFilename = file.getOriginalFilename();
            String extension = "";

            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String uniqueFileName = UUID.randomUUID() + extension;

            Files.copy(file.getInputStream(), this.root.resolve(uniqueFileName));

            return uniqueFileName;
        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }

    public void delete(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return;
        }

        try {
            Path fileToDelete = root.resolve(fileName);
            Files.deleteIfExists(fileToDelete);
        } catch (IOException e) {
            System.err.println("Failed to delete file: " + fileName + ". Error: " + e.getMessage());
        }
    }
}