package com.xadazhii.server.controllers;

import com.xadazhii.server.payload.response.MessageResponse;
import com.xadazhii.server.security.details.UserDetailsImpl;
import com.xadazhii.server.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private com.xadazhii.server.security.jwt.JwtUtils jwtUtils;

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(UserController.class);

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/users/{userId}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserRole(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        try {
            userService.updateUserRole(userId, request.get("role"));
            return ResponseEntity.ok(new MessageResponse("Rola používateľa bola úspešne zmenená."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/user/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> request) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            userService.updatePassword(userDetails.getId(), request.get("currentPassword"), request.get("newPassword"));
            return ResponseEntity.ok(new MessageResponse("Heslo bolo úspešne zmenené."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping("/users/{userId}/password")
    @PreAuthorize("isAuthenticated() && (#userId == principal.id)")
    public ResponseEntity<?> updateUserPassword(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        try {
            userService.updatePassword(userId, request.get("oldPassword"), request.get("newPassword"));
            return ResponseEntity.ok(new MessageResponse("Heslo bolo úspešne zmenené."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping("/users/{userId}/username")
    @PreAuthorize("isAuthenticated() && (#userId == principal.id)")
    public ResponseEntity<?> updateUsername(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        try {
            String newUsername = request.get("username");
            logger.info("Zmena mena pre používateľa ID {}: na {}", userId, newUsername);
            userService.updateUsername(userId, newUsername);
            String newToken = jwtUtils.generateTokenFromUsername(newUsername);
            return ResponseEntity.ok(Map.of(
                "message", "Používateľské meno bolo úspešne zmenené.",
                "accessToken", newToken,
                "username", newUsername
            ));
        } catch (Exception e) {
            logger.error("Chyba pri zmene mena ID {}: {}", userId, e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping("/users/{userId}/pseudonym")
    @PreAuthorize("isAuthenticated() && (#userId == principal.id)")
    public ResponseEntity<?> updatePseudonym(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        try {
            userService.updatePseudonym(userId, request.get("pseudonym"));
            return ResponseEntity.ok(new MessageResponse("Pseudonym bol úspešne zmenený."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.ok(new MessageResponse("Používateľ bol úspešne vymazaný."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/classmates")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Map<String, Object>>> getClassmates() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(userService.getClassmates(userDetails.getId()));
    }

    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUserProfile() {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            return ResponseEntity.ok(userService.getUserProfile(userDetails.getId()));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(new MessageResponse(e.getMessage()));
        }
    }
}
