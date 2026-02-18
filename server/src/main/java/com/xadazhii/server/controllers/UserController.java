package com.xadazhii.server.controllers;

import com.xadazhii.server.models.ERole;
import com.xadazhii.server.models.Role;
import com.xadazhii.server.models.TestResult;
import com.xadazhii.server.models.User;
import com.xadazhii.server.payload.response.MessageResponse;
import com.xadazhii.server.repository.RoleRepository;
import com.xadazhii.server.repository.TestResultRepository;
import com.xadazhii.server.repository.UserRepository;
import com.xadazhii.server.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "https://btsss-stu-fei.netlify.app", maxAge = 3600)
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
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found."));
        }
        userRepository.deleteById(userId);
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
}