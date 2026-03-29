package com.xadazhii.server.config;

import com.xadazhii.server.models.Role;
import com.xadazhii.server.models.ERole;
import com.xadazhii.server.models.User;
import com.xadazhii.server.models.Test;
import com.xadazhii.server.models.Question;
import com.xadazhii.server.models.Answer;
import com.xadazhii.server.repository.RoleRepository;
import com.xadazhii.server.repository.UserRepository;
import com.xadazhii.server.repository.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

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
    private TestRepository testRepository;
 
    @Autowired
    private PasswordEncoder passwordEncoder;
 
    @Override
    @Transactional
    public void run(String... args) {
        migrateTestScores();

        if (adminUsername == null || adminUsername.isEmpty() ||
                adminPassword == null || adminPassword.isEmpty()) {
            System.out.println("AdminInitializer: Admin credentials not set. Skipping.");
            return;
        }

        if (!userRepository.existsByUsername(adminUsername)) {
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Chyba: ROLE_ADMIN nebola nájdená."));

            User admin = new User();
            admin.setUsername(adminUsername);
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRoles(Collections.singleton(adminRole));

            userRepository.save(admin);
            System.out.println("AdminInitializer: Administrátor bol úspešne vytvorený.");
        } else {
            userRepository.findByUsername(adminUsername).ifPresent(adminUser -> {
                adminUser.setEmail(adminEmail);
                adminUser.setPassword(passwordEncoder.encode(adminPassword));
                userRepository.save(adminUser);
                System.out.println("AdminInitializer: Údaje administrátora boli aktualizované.");
            });
        }
        System.out.println("AdminInitializer: Base admin setup complete.");
    }

    private void migrateTestScores() {
        System.out.println("AdminInitializer: Checking for test score migrations...");
        List<Test> specialTests = testRepository.findAll().stream()
                .filter(t -> t.getWeekNumber() != null && (t.getWeekNumber() == 0 || t.getWeekNumber() == 13 || t.getWeekNumber() == 14))
                .collect(Collectors.toList());

        for (Test test : specialTests) {
            boolean changed = false;
            for (Question q : test.getQuestions()) {
                if (q.getPoints() != 2) {
                    q.setPoints(2);
                    changed = true;
                }
                long correctCount = q.getAnswers().stream().filter(a -> a.getPointsWeight() > 0).count();
                if (correctCount > 0) {
                    int weightPerCorrect = (int) (2 / correctCount);
                    if (weightPerCorrect < 1) weightPerCorrect = 1;
                    for (Answer a : q.getAnswers()) {
                        if (a.getPointsWeight() > 0 && a.getPointsWeight() != weightPerCorrect) {
                            a.setPointsWeight(weightPerCorrect);
                            changed = true;
                        }
                    }
                }
            }
            if (changed) {
                testRepository.save(test);
                System.out.println("AdminInitializer: Updated scores for test: " + test.getTitle());
            }
        }
    }
}
