package com.xadazhii.server.controllers;

import com.xadazhii.server.models.AllowedStudent;
import com.xadazhii.server.payload.request.AllowedStudentRequest;
import com.xadazhii.server.payload.response.MessageResponse;
import com.xadazhii.server.repository.AllowedStudentRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@CrossOrigin(origins = "https://btsss-stu-fei.netlify.app", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class AllowedStudentController {

    @Autowired
    private AllowedStudentRepository allowedStudentRepository;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}");

    @GetMapping("/allowed-students")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<AllowedStudent>> getAllowedStudents() {
        return ResponseEntity.ok(allowedStudentRepository.findAll());
    }

    @PostMapping("/allowed-students")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addAllowedStudent(@RequestBody AllowedStudentRequest request) {
        if (allowedStudentRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already on the list!"));
        }
        AllowedStudent newStudent = new AllowedStudent(request.getEmail());
        AllowedStudent savedStudent = allowedStudentRepository.save(newStudent);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedStudent);
    }

    @DeleteMapping("/allowed-students")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional // ИСПРАВЛЕНИЕ: Добавлена транзакция для безопасного удаления
    public ResponseEntity<MessageResponse> deleteAllowedStudentByEmail(@RequestParam String email) {
        if (!allowedStudentRepository.existsByEmail(email)) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Student with email " + email + " not found on the allowed list."));
        }
        allowedStudentRepository.deleteByEmail(email);
        return ResponseEntity.ok(new MessageResponse("Student removed from the allowed list."));
    }

    @PostMapping("/students/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> uploadStudentsFromPdf(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty() || !"application/pdf".equals(file.getContentType())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Please upload a valid PDF file."));
        }

        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            Matcher matcher = EMAIL_PATTERN.matcher(text);

            int count = 0;
            while (matcher.find()) {
                String email = matcher.group();
                if (!allowedStudentRepository.existsByEmail(email)) {
                    allowedStudentRepository.save(new AllowedStudent(email));
                    count++;
                }
            }
            return ResponseEntity.ok(new MessageResponse(count + " new unique emails added from PDF."));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error processing PDF file: " + e.getMessage()));
        }
    }
}