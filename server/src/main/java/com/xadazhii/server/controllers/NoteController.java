package com.xadazhii.server.controllers;

import com.xadazhii.server.models.Note;
import com.xadazhii.server.payload.response.MessageResponse;
import com.xadazhii.server.security.details.UserDetailsImpl;
import com.xadazhii.server.services.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    @Autowired
    NoteService noteService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Note>> getMyNotes() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        return ResponseEntity.ok(noteService.myNotes(userDetails.getId()));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createNote(@RequestParam("content") String content,
            @RequestParam(value = "category", defaultValue = "Všeobecné") String category,
            @RequestParam(value = "files", required = false) MultipartFile[] files,
            @RequestParam(value = "files[]", required = false) MultipartFile[] filesBrackets) {
        Long userId = ((UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getId();
        MultipartFile[] allFiles = files != null ? files : filesBrackets;
        Note note = noteService.createNote(userId, content, category, allFiles);
        return ResponseEntity.ok(note);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteNote(@PathVariable @lombok.NonNull Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        noteService.deleteNote(userDetails.getId(), id);
        return ResponseEntity.ok(new MessageResponse("Poznámka bola úspešne vymazaná"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateNote(@PathVariable @lombok.NonNull Long id,
            @RequestParam("content") String content,
            @RequestParam(value = "category", defaultValue = "Všeobecné") String category,
            @RequestParam(value = "files", required = false) MultipartFile[] files,
            @RequestParam(value = "files[]", required = false) MultipartFile[] filesBrackets) {
        Long userId = ((UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getId();
        MultipartFile[] allFiles = files != null ? files : filesBrackets;
        Note note = noteService.updateNote(userId, id, content, category, allFiles);
        return ResponseEntity.ok(note);
    }
}