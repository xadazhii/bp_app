package com.xadazhii.server.config;

import com.xadazhii.server.models.Role;
import com.xadazhii.server.models.ERole;
import com.xadazhii.server.models.User;
import com.xadazhii.server.repository.RoleRepository;
import com.xadazhii.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.Collections;

@Component
@Order(2)
public class AdminInitializer implements CommandLineRunner {

    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        if (adminUsername == null || adminUsername.isEmpty() ||
                adminPassword == null || adminPassword.isEmpty()) {
            System.out.println("AdminInitializer: Admin credentials not set. Skipping.");
            return;
        }

        if (!userRepository.existsByUsername(adminUsername)) {

            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Error: ROLE_ADMIN not found."));

            User admin = new User();
            admin.setUsername(adminUsername);
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRoles(Collections.singleton(adminRole));

            userRepository.save(admin);

            System.out.println("AdminInitializer: Admin user created.");
        } else {
            System.out.println("AdminInitializer: Admin already exists.");
        }
    }
}