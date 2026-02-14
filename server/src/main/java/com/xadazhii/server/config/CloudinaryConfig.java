package com.xadazhii.server.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class CloudinaryConfig {

    private final Cloudinary cloudinary;

    public CloudinaryConfig(@Value("${cloudinary.cloud_name}") String cloudName,
                            @Value("${cloudinary.api_key}") String apiKey,
                            @Value("${cloudinary.api_secret}") String apiSecret) {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", cloudName);
        config.put("api_key", apiKey);
        config.put("api_secret", apiSecret);
        this.cloudinary = new Cloudinary(config);
    }

    public String store(MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type", "auto"
                    ));
            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
            throw new RuntimeException("Nepodarilo sa uložiť súbor. Chyba: " + e.getMessage());
        }
    }

    public void delete(String fileUrl) {
        try {
            if (fileUrl == null || fileUrl.isEmpty()) {
                return;
            }

            Pattern pattern = Pattern.compile("/(image|raw|video)/upload/v\\d+/(.+)");
            Matcher matcher = pattern.matcher(fileUrl);

            if (matcher.find()) {
                String resourceType = matcher.group(1);
                String publicIdWithExtension = matcher.group(2);

                int lastDotIndex = publicIdWithExtension.lastIndexOf('.');
                String publicId = (lastDotIndex > 0) ? publicIdWithExtension.substring(0, lastDotIndex) : publicIdWithExtension;

                if (!publicId.isEmpty()) {
                    cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", resourceType));
                    System.out.println("Súbor '" + publicId + "' typu '" + resourceType + "' bol úspešne odstránený.");
                }
            } else {
                System.err.println("Nepodarilo sa extrahovať Public ID z URL: " + fileUrl);
            }
        } catch (IOException e) {
            System.err.println("Nepodarilo sa vymazať súbor z Cloudinary: " + e.getMessage());
        }
    }
}