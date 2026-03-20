package com.xadazhii.server.controllers;

import com.xadazhii.server.models.AllowedStudent;
import com.xadazhii.server.payload.request.AllowedStudentRequest;
import com.xadazhii.server.payload.response.MessageResponse;
import com.xadazhii.server.services.AllowedStudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api")
public class AllowedStudentController {

    @Autowired
    private AllowedStudentService allowedStudentService;

    @GetMapping("/allowed-students")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<AllowedStudent>> getAllowedStudents() {
        return ResponseEntity.ok(allowedStudentService.getAllAllowedStudents());
    }

    @PostMapping("/allowed-students")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addAllowedStudent(@RequestBody AllowedStudentRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(allowedStudentService.addAllowedStudent(request.getEmail()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/allowed-students")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteAllowedStudentByEmail(@RequestParam String email) {
        try {
            allowedStudentService.deleteAllowedStudentByEmail(email);
            return ResponseEntity.ok(new MessageResponse("Študent a jeho účet boli odstránené."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/students/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> uploadStudentsFromPdf(@RequestParam("file") MultipartFile file) {
        try {
            List<String> added = allowedStudentService.uploadStudentsFromPdf(file);
            return ResponseEntity.ok(new MessageResponse("Úspešne pridaných " + added.size() + " študentov z PDF."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}
