package com.xadazhii.server.services;

import com.xadazhii.server.models.ERole;
import com.xadazhii.server.models.Role;
import com.xadazhii.server.models.User;
import com.xadazhii.server.repository.RoleRepository;
import com.xadazhii.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    public List<Map<String, Object>> getAllUsers() {
        return userRepository.findAll().stream().map(user -> {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("username", user.getUsername());
            userMap.put("email", user.getEmail());
            String role = user.getRoles().stream()
                    .map(r -> r.getName().name())
                    .findFirst().orElse("ROLE_USER")
                    .replace("ROLE_", "").toLowerCase();
            userMap.put("role", role);
            return userMap;
        }).collect(Collectors.toList());
    }

    public void updateUserRole(Long userId, String strRole) {
        User user = userRepository.findById(java.util.Objects.requireNonNull(userId))
                .orElseThrow(() -> new RuntimeException("Chyba: Používateľ nebol nájdený."));

        if (user.getEmail() != null && user.getEmail().equals(adminEmail)) {
            throw new RuntimeException("Chyba: Nie je možné zmeniť rolu hlavného administrátora.");
        }

        ERole roleEnum = switch (strRole.toLowerCase()) {
            case "admin" -> ERole.ROLE_ADMIN;
            default -> ERole.ROLE_USER;
        };

        Role role = roleRepository.findByName(roleEnum)
                .orElseThrow(() -> new RuntimeException("Chyba: Rola nebola nájdená."));
        user.setRoles(Collections.singleton(role));
        userRepository.save(user);
    }

    public void updatePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(java.util.Objects.requireNonNull(userId))
                .orElseThrow(() -> new RuntimeException("Interná chyba: Používateľ nebol nájdený."));

        if (!encoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Chyba: Súčasné heslo je nesprávne.");
        }

        user.setPassword(encoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(java.util.Objects.requireNonNull(userId))
                .orElseThrow(() -> new RuntimeException("Chyba: Používateľ nebol nájdený."));

        if (user.getEmail() != null && user.getEmail().equals(adminEmail)) {
            throw new RuntimeException("Chyba: Nie je možné vymazať hlavného administrátora.");
        }
        userRepository.delete(user);
    }

    public List<Map<String, Object>> getClassmates(Long currentUserId) {
        return userRepository.findAll().stream()
                .filter(u -> !u.getId().equals(currentUserId))
                .map(u -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", u.getId());
                    map.put("username", u.getUsername());
                    map.put("points", u.getPoints());
                    return map;
                }).collect(Collectors.toList());
    }

    public Map<String, Object> getUserProfile(Long userId) {
        User user = userRepository.findById(java.util.Objects.requireNonNull(userId))
                .orElseThrow(() -> new RuntimeException("Používateľ nebol nájdený."));
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("username", user.getUsername());
        profile.put("email", user.getEmail());
        profile.put("points", user.getPoints());
        return profile;
    }
}
