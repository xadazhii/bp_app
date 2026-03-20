package com.xadazhii.server.services;

import com.xadazhii.server.models.AllowedStudent;
import com.xadazhii.server.repository.*;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AllowedStudentService {

    @Autowired
    private AllowedStudentRepository allowedStudentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TestResultRepository testResultRepository;

    @Autowired
    private UserProgressRepository userProgressRepository;

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private MaterialRepository materialRepository;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}");

    public List<AllowedStudent> getAllAllowedStudents() {
        return allowedStudentRepository.findAll();
    }

    public AllowedStudent addAllowedStudent(String email) {
        if (allowedStudentRepository.existsByEmail(email)) {
            throw new RuntimeException("Chyba: Email je už na zozname!");
        }
        return allowedStudentRepository.save(new AllowedStudent(email));
    }

    @Transactional
    public void deleteAllowedStudentByEmail(String email) {
        if (!allowedStudentRepository.existsByEmail(email)) {
            throw new RuntimeException("Chyba: Študent s emailom " + email + " sa nenašiel na zozname povolených.");
        }

        userRepository.findByEmail(email).ifPresent(user -> {
            Long userId = user.getId();
            testResultRepository.deleteByStudentId(userId);
            userProgressRepository.deleteByUserId(userId);
            noteRepository.deleteByUserId(userId);
            materialRepository.setUploaderToNull(userId);
            userRepository.delete(user);
        });

        allowedStudentRepository.deleteByEmail(email);
    }

    public List<String> uploadStudentsFromPdf(MultipartFile file) throws IOException {
        if (file.isEmpty() || !"application/pdf".equals(file.getContentType())) {
            throw new RuntimeException("Chyba: Nahrajte platný súbor PDF.");
        }

        List<String> added = new ArrayList<>();
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            Matcher matcher = EMAIL_PATTERN.matcher(text);

            while (matcher.find()) {
                String email = matcher.group().toLowerCase();
                if (!allowedStudentRepository.existsByEmail(email)) {
                    allowedStudentRepository.save(new AllowedStudent(email));
                    added.add(email);
                }
            }
        }
        return added;
    }
}
