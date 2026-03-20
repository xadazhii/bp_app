package com.xadazhii.server.storage;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Component
@ConditionalOnProperty(name = "btsss.app.storage", havingValue = "cloudinary")
public class CloudinaryStorageStrategy implements FileStorageStrategy {

    @Autowired
    private Cloudinary cloudinary;

    @Override
    public String store(MultipartFile file) {
        try {
            Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            return result.get("url").toString();
        } catch (IOException e) {
            throw new RuntimeException("Chyba pri nahrávaní na Cloudinary: " + e.getMessage());
        }
    }

    @Override
    public void delete(String fileRef) {
        if (fileRef == null || !fileRef.contains("cloudinary.com")) return;
        try {
            String publicId = extractPublicId(fileRef);
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            System.err.println("Chyba pri mazaní z Cloudinary: " + e.getMessage());
        }
    }

    @Override
    public String getPublicUrl(String fileRef, String baseUrl) {
        return fileRef;
    }

    private String extractPublicId(String url) {
        String[] parts = url.split("/");
        String fileName = parts[parts.length - 1];
        return fileName.substring(0, fileName.lastIndexOf("."));
    }
}
