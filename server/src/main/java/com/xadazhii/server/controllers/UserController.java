package com.xadazhii.server.controllers;

import com.xadazhii.server.models.ERole;
import com.xadazhii.server.models.Role;
import com.xadazhii.server.models.TestResult;
import com.xadazhii.server.models.User;
import com.xadazhii.server.payload.response.MessageResponse;
import com.xadazhii.server.repository.AllowedStudentRepository;
import com.xadazhii.server.repository.MaterialRepository;
import com.xadazhii.server.repository.NoteRepository;
import com.xadazhii.server.repository.RoleRepository;
import com.xadazhii.server.repository.TestResultRepository;
import com.xadazhii.server.repository.UserProgressRepository;
import com.xadazhii.server.repository.UserRepository;
import com.xadazhii.server.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = { "https://btsss-stu-fei.netlify.app", "http://localhost:3000" }, maxAge = 3600)
@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    private TestResultRepository testResultRepository;

    @Autowired
    private UserProgressRepository userProgressRepository;

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private AllowedStudentRepository allowedStudentRepository;

    @Value("${app.admin.email}")
    private String adminEmail;

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> users = userRepository.findAll();

        List<Map<String, Object>> response = users.stream().map(user -> {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("username", user.getUsername());
            userMap.put("email", user.getEmail());
            String role = user.getRoles().stream()
                    .map(r -> r.getName().name())
                    .findFirst()
                    .orElse("ROLE_USER")
                    .replace("ROLE_", "")
                    .toLowerCase();
            userMap.put("role", role);
            return userMap;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/users/{userId}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserRole(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));

        if (user.getEmail() != null && user.getEmail().equals(adminEmail)) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Cannot change role of main administrator."));
        }

        String strRole = request.get("role");
        Set<Role> roles = new HashSet<>();
        Role newRole;

        switch (strRole) {
            case "admin":
                newRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                break;
            default:
                newRole = roleRepository.findByName(ERole.ROLE_USER)
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        }

        roles.add(newRole);
        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User role updated successfully!"));
    }

    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));

        if (user.getEmail() != null && user.getEmail().equals(adminEmail)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Cannot delete main administrator."));
        }

        // Delete student test results and progress first to satisfy constraints
        testResultRepository.deleteByStudentId(userId);
        userProgressRepository.deleteByUserId(userId);
        noteRepository.deleteByUserId(userId);
        materialRepository.setUploaderToNull(userId);

        // Also remove from allowed list if exists
        allowedStudentRepository.deleteByEmail(user.getEmail());

        userRepository.delete(user);
        return ResponseEntity.ok(new MessageResponse("User deleted successfully!"));
    }

    @PutMapping("/users/{userId}/username")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateUsername(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long currentUserId = userDetails.getId();

        if (!currentUserId.equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Error: You are not authorized to change this user's name!"));
        }

        String newUsername = request.get("username");
        if (newUsername == null || newUsername.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username cannot be empty."));
        }

        if (userRepository.existsByUsername(newUsername)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));

        user.setUsername(newUsername);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Username updated successfully!"));
    }

    @PutMapping("/users/{userId}/password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateUserPassword(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long currentUserId = userDetails.getId();

        if (!currentUserId.equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Error: You are not authorized to change this user's password!"));
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));

        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");

        if (oldPassword == null || newPassword == null || newPassword.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Old password and new password must be provided."));
        }

        if (!encoder.matches(oldPassword, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Error: Incorrect old password."));
        }

        user.setPassword(encoder.encode(newPassword));

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User password updated successfully!"));
    }

    @GetMapping("/total-score")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getTotalScore() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Long currentUserId = userDetails.getId();

        List<TestResult> userResults = testResultRepository.findByStudentId(currentUserId);

        int totalScore = userResults.stream()
                .collect(Collectors.groupingBy(
                        result -> result.getTest().getId(),
                        Collectors.mapping(TestResult::getScore, Collectors.maxBy(Integer::compare))))
                .values().stream()
                .mapToInt(opt -> opt.orElse(0))
                .sum();

        Map<String, Integer> response = new HashMap<>();
        response.put("totalScore", totalScore);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile/info")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUserInfo() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User not found"));

        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("id", user.getId());
        responseMap.put("username", user.getUsername());
        responseMap.put("email", user.getEmail());
        responseMap.put("pseudonym", user.getPseudonym());

        return ResponseEntity.ok(responseMap);
    }

    @PutMapping("/profile/pseudonym")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updatePseudonym(@RequestBody Map<String, String> payload) {
        String pseudonym = payload.get("pseudonym");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Error: Unauthorized"));
        }

        UserDetailsImpl currentUser = (UserDetailsImpl) authentication.getPrincipal();

        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));

        user.setPseudonym(pseudonym);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Pseudonym bol aktualizovaný!"));
    }

    @GetMapping("/profile/scores/{studentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TestResult>> getStudentScores(@PathVariable Long studentId) {
        List<TestResult> results = testResultRepository.findByStudentId(studentId);
        return ResponseEntity.ok(results);
    }
}