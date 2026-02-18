package com.xadazhii.server.controllers;

import com.xadazhii.server.models.Note;
import com.xadazhii.server.models.User;
import com.xadazhii.server.payload.response.MessageResponse;
import com.xadazhii.server.repository.NoteRepository;
import com.xadazhii.server.repository.UserRepository;
import com.xadazhii.server.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = { "https://btsss-stu-fei.netlify.app", "http://localhost:3000",
        "http://localhost:8081" }, maxAge = 3600)
@RestController
@RequestMapping("/api/notes")
public class NoteController {

    @Autowired
    NoteRepository noteRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Note>> getMyNotes() {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                    .getPrincipal();
            return ResponseEntity.ok(noteRepository
                    .findByUserIdOrderByCreatedAtDesc(java.util.Objects.requireNonNull(userDetails.getId())));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @Autowired
    com.xadazhii.server.security.services.FileStorageService fileStorageService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createNote(@RequestParam("content") String content,
            @RequestParam(value = "category", defaultValue = "Všeobecné") String category,
            @RequestParam(value = "files", required = false) org.springframework.web.multipart.MultipartFile[] files,
            @RequestParam(value = "files[]", required = false) org.springframework.web.multipart.MultipartFile[] filesBrackets) {
        try {
            Long userId = ((UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                    .getId();
            User user = userRepository.findById(java.util.Objects.requireNonNull(userId)).orElseThrow();

            org.springframework.web.multipart.MultipartFile[] allFiles = files != null ? files : filesBrackets;
            String firstImagePath = null;
            String updatedContent = content;

            System.out.println("NOTE_DEBUG: incoming content=" + content);

            if (allFiles != null && allFiles.length > 0) {
                System.out.println("NOTE_DEBUG: processing " + allFiles.length + " files");
                for (int i = 0; i < allFiles.length; i++) {
                    org.springframework.web.multipart.MultipartFile file = allFiles[i];
                    if (file != null && !file.isEmpty()) {
                        String path = fileStorageService.store(file);
                        if (firstImagePath == null)
                            firstImagePath = path;
                        String placeholder = "[[FILE_" + i + "]]";
                        updatedContent = updatedContent.replace(placeholder, path);
                        System.out.println("NOTE_DEBUG: replaced " + placeholder + " with " + path);
                    }
                }
            } else {
                System.out.println("NOTE_DEBUG: no files received");
            }

            Note note = new Note(updatedContent, category, firstImagePath, user);
            noteRepository.save(note);

            return ResponseEntity.ok(note);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(new MessageResponse("Internal Server Error: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteNote(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Long userId = userDetails.getId();
        if (userId == null)
            return ResponseEntity.badRequest().build();
        Note note = noteRepository.findById(java.util.Objects.requireNonNull(id)).orElseThrow();

        if (!note.getUser().getId().equals(userId)) {
            return ResponseEntity.status(403).body(new MessageResponse("Error: Unauthorized"));
        }

        noteRepository.delete(note);
        return ResponseEntity.ok(new MessageResponse("Note deleted successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateNote(@PathVariable Long id,
            @RequestParam("content") String content,
            @RequestParam(value = "category", defaultValue = "Všeobecné") String category,
            @RequestParam(value = "files", required = false) org.springframework.web.multipart.MultipartFile[] files,
            @RequestParam(value = "files[]", required = false) org.springframework.web.multipart.MultipartFile[] filesBrackets) {
        try {
            Long userId = ((UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                    .getId();
            Note note = noteRepository.findById(id).orElseThrow();

            if (!note.getUser().getId().equals(userId)) {
                return ResponseEntity.status(403).body(new MessageResponse("Error: Unauthorized"));
            }

            org.springframework.web.multipart.MultipartFile[] allFiles = files != null ? files : filesBrackets;
            String updatedContent = content;
            String firstImagePath = note.getImagePath();

            if (allFiles != null && allFiles.length > 0) {
                int fileSlot = 0;
                for (org.springframework.web.multipart.MultipartFile file : allFiles) {
                    if (file != null && !file.isEmpty()) {
                        String path = fileStorageService.store(file);
                        if (fileSlot == 0)
                            firstImagePath = path;

                        // Find the first available [[FILE_i]] placeholder that hasn't been replaced yet
                        // Or just replace [[FILE_i]] where i is the index in the current upload batch
                        updatedContent = updatedContent.replace("[[FILE_" + fileSlot + "]]", path);
                        fileSlot++;
                    }
                }
            }

            note.setContent(updatedContent);
            note.setCategory(category);
            note.setImagePath(firstImagePath);
            noteRepository.save(note);

            return ResponseEntity.ok(note);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new MessageResponse("Error updating note: " + e.getMessage()));
        }
    }
}
