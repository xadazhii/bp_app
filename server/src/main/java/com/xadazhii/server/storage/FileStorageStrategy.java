package com.xadazhii.server.storage;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageStrategy {
    String store(MultipartFile file);
    void delete(String fileRef);
    String getPublicUrl(String fileRef, String baseUrl);
}
