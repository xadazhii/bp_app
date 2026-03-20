package com.xadazhii.server.services;

import com.xadazhii.server.models.Note;
import com.xadazhii.server.models.User;
import com.xadazhii.server.repository.NoteRepository;
import com.xadazhii.server.repository.UserRepository;
import com.xadazhii.server.storage.FileStorageStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageStrategy fileStorage;

    public List<Note> myNotes(Long userId) {
        return noteRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Note createNote(Long userId, String content, String category, MultipartFile[] files) {
        User user = userRepository.findById(java.util.Objects.requireNonNull(userId))
                .orElseThrow(() -> new RuntimeException("Používateľ nebol nájdený"));

        String updatedContent = processContent(content, files);
        String firstImagePath = extractFirstImagePath(updatedContent);

        Note note = new Note(updatedContent, category, firstImagePath, user);
        return noteRepository.save(note);
    }

    public Note updateNote(Long userId, Long id, String content, String category, MultipartFile[] files) {
        Note note = noteRepository.findById(java.util.Objects.requireNonNull(id))
                .orElseThrow(() -> new NoSuchElementException("Poznámka nebola nájdená"));

        if (!note.getUser().getId().equals(userId)) {
            throw new RuntimeException("Chyba: Neautorizovaný prístup");
        }

        String updatedContent = processContent(content, files);
        String firstImagePath = extractFirstImagePath(updatedContent);

        note.setContent(updatedContent);
        note.setCategory(category);
        note.setImagePath(firstImagePath);
        return noteRepository.save(note);
    }

    private String processContent(String content, MultipartFile[] files) {
        String updatedContent = content;

        if (files != null && files.length > 0) {
            for (int i = 0; i < files.length; i++) {
                MultipartFile file = files[i];
                if (file != null && !file.isEmpty()) {
                    String ref = fileStorage.store(file);
                    updatedContent = updatedContent.replace("[[FILE_" + i + "]]", ref);
                }
            }
        }

        if (updatedContent.contains("data:image")) {
            java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("\"type\":\"drawing\",\"value\":\"(data:image/[^;]+;base64,[^\"]+)\"");
            java.util.regex.Matcher matcher = pattern.matcher(updatedContent);
            StringBuilder sb = new StringBuilder();
            int lastEnd = 0;
            while (matcher.find()) {
                sb.append(updatedContent, lastEnd, matcher.start());
                String base64Data = matcher.group(1);
                try {
                    String fileRef = storeBase64Image(base64Data);
                    sb.append("\"type\":\"drawing\",\"value\":\"").append(fileRef).append("\"");
                } catch (Exception e) {
                    sb.append(matcher.group(0));
                }
                lastEnd = matcher.end();
            }
            sb.append(updatedContent.substring(lastEnd));
            updatedContent = sb.toString();
        }

        return updatedContent;
    }

    private String storeBase64Image(String base64Data) throws java.io.IOException {
        String[] parts = base64Data.split(",");
        String imageInfo = parts[0];
        String data = parts[1];
        String extension = ".png";
        if (imageInfo.contains("jpeg")) extension = ".jpg";
        else if (imageInfo.contains("gif")) extension = ".gif";

        byte[] imageBytes = java.util.Base64.getDecoder().decode(data);
        String fileName = java.util.UUID.randomUUID().toString() + extension;

        MultipartFile multipartFile = new CustomMultipartFile(imageBytes, fileName, imageInfo.split(":")[1].split(";")[0]);
        return fileStorage.store(multipartFile);
    }

    private String extractFirstImagePath(String content) {
        if (content == null) return null;
        if (content.contains("\"type\":\"image\",\"value\":\"")) {
            int start = content.indexOf("\"type\":\"image\",\"value\":\"") + 24;
            int end = content.indexOf("\"", start);
            if (start > 24 && end > start) return content.substring(start, end);
        }
        if (content.contains("\"type\":\"drawing\",\"value\":\"")) {
            int start = content.indexOf("\"type\":\"drawing\",\"value\":\"") + 26;
            int end = content.indexOf("\"", start);
            if (start > 26 && end > start) return content.substring(start, end);
        }
        return null;
    }

    private static class CustomMultipartFile implements MultipartFile {
        private final byte[] content;
        private final String name;
        private final String contentType;
        public CustomMultipartFile(byte[] content, String name, String contentType) {
            this.content = content;
            this.name = name;
            this.contentType = contentType;
        }
        @Override @org.springframework.lang.NonNull public String getName() { return java.util.Objects.requireNonNull(name); }
        @Override public String getOriginalFilename() { return name; }
        @Override public String getContentType() { return contentType; }
        @Override public boolean isEmpty() { return content.length == 0; }
        @Override public long getSize() { return content.length; }
        @Override @org.springframework.lang.NonNull public byte[] getBytes() { return java.util.Objects.requireNonNull(content); }
        @Override @org.springframework.lang.NonNull public java.io.InputStream getInputStream() { return new java.io.ByteArrayInputStream(content); }
        @Override public void transferTo(@org.springframework.lang.NonNull java.io.File dest) throws java.io.IOException { java.nio.file.Files.write(dest.toPath(), content); }
    }

    public void deleteNote(Long userId, Long id) {
        Note note = noteRepository.findById(java.util.Objects.requireNonNull(id))
                .orElseThrow(() -> new NoSuchElementException("Poznámka nebola nájdená"));

        if (!note.getUser().getId().equals(userId)) {
            throw new RuntimeException("Chyba: Neautorizovaný prístup");
        }

        if (note.getImagePath() != null) {
            fileStorage.delete(note.getImagePath());
        }

        noteRepository.delete(note);
    }
}
