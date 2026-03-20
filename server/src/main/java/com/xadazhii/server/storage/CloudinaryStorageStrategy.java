package com.xadazhii.server.storage;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Component
@org.springframework.context.annotation.Primary
public class CloudinaryStorageStrategy implements FileStorageStrategy {

    @Autowired
    private Cloudinary cloudinary;

    @Override
    public String store(MultipartFile file) {
        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("resource_type", "auto"));
            Object secureUrl = uploadResult.get("secure_url");
            return secureUrl != null ? secureUrl.toString() : uploadResult.get("url").toString();
        } catch (IOException e) {
            throw new RuntimeException("Chyba pri nahrávaní na Cloudinary: " + e.getMessage());
        }
    }

    @Override
    public void delete(String fileUrl) {
        try {
            if (fileUrl == null || fileUrl.isEmpty() || !fileUrl.contains("cloudinary.com")) {
                return;
            }

            java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("/(image|raw|video)/upload/v\\d+/(.+)");
            java.util.regex.Matcher matcher = pattern.matcher(fileUrl);

            if (matcher.find()) {
                String resourceType = matcher.group(1);
                String publicIdWithExtension = matcher.group(2);

                int lastDotIndex = publicIdWithExtension.lastIndexOf('.');
                String publicId = (lastDotIndex > 0) ? publicIdWithExtension.substring(0, lastDotIndex)
                        : publicIdWithExtension;

                if (!publicId.isEmpty()) {
                    cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", resourceType));
                }
            }
        } catch (Exception e) {
            System.err.println("Nepodarilo sa vymazať súbor z Cloudinary: " + e.getMessage());
        }
    }

    @Override
    public String getPublicUrl(String fileRef, String baseUrl) {
        return fileRef;
    }
}
