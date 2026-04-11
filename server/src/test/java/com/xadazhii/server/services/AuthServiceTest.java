package com.xadazhii.server.services;

import com.xadazhii.server.models.AllowedStudent;
import com.xadazhii.server.models.ERole;
import com.xadazhii.server.models.Role;
import com.xadazhii.server.models.User;
import com.xadazhii.server.payload.request.SignupRequest;
import com.xadazhii.server.repository.AllowedStudentRepository;
import com.xadazhii.server.repository.RoleRepository;
import com.xadazhii.server.repository.UserRepository;
import com.xadazhii.server.security.jwt.JwtUtils;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService — Unit тести")
public class AuthServiceTest {

    @Mock private AuthenticationManager authenticationManager;
    @Mock private UserRepository userRepository;
    @Mock private RoleRepository roleRepository;
    @Mock private PasswordEncoder encoder;
    @Mock private JwtUtils jwtUtils;
    @Mock private AllowedStudentRepository allowedStudentRepository;

    @InjectMocks
    private AuthService authService;

    private SignupRequest makeSignupRequest(String username, String email, String password) {
        SignupRequest req = new SignupRequest();
        req.setUsername(username);
        req.setEmail(email);
        req.setPassword(password);
        return req;
    }

    @Nested
    @DisplayName("registerUser — реєстрація користувача")
    class RegisterUserTests {

        @Test
        @DisplayName("Успішна реєстрація: дозволений email, вільний username та email")
        void registerUser_success() {
            SignupRequest req = makeSignupRequest("student01", "student@test.com", "password123");

            AllowedStudent allowed = new AllowedStudent();
            allowed.setEmail("student@test.com");

            Role userRole = new Role();
            userRole.setName(ERole.ROLE_USER);

            when(allowedStudentRepository.findByEmail("student@test.com")).thenReturn(Optional.of(allowed));
            when(userRepository.existsByUsername("student01")).thenReturn(false);
            when(userRepository.existsByEmail("student@test.com")).thenReturn(false);
            when(encoder.encode("password123")).thenReturn("$hashed_password$");
            when(roleRepository.findByName(ERole.ROLE_USER)).thenReturn(Optional.of(userRole));

            assertThatCode(() -> authService.registerUser(req)).doesNotThrowAnyException();

            verify(userRepository, times(1)).save(any(User.class));
        }

        @Test
        @DisplayName("Кидає RuntimeException якщо email не в дозволеному списку")
        void registerUser_emailNotAllowed_throwsException() {
            SignupRequest req = makeSignupRequest("hacker", "hacker@evil.com", "pass");

            when(allowedStudentRepository.findByEmail("hacker@evil.com")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> authService.registerUser(req))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Registrácia je povolená len");

            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Кидає RuntimeException якщо username вже зайнятий")
        void registerUser_usernameAlreadyTaken_throwsException() {
            SignupRequest req = makeSignupRequest("existingUser", "student@test.com", "pass");

            AllowedStudent allowed = new AllowedStudent();
            allowed.setEmail("student@test.com");

            when(allowedStudentRepository.findByEmail("student@test.com")).thenReturn(Optional.of(allowed));
            when(userRepository.existsByUsername("existingUser")).thenReturn(true);

            assertThatThrownBy(() -> authService.registerUser(req))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Používateľské meno");

            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Кидає RuntimeException якщо email вже зареєстровано")
        void registerUser_emailAlreadyRegistered_throwsException() {
            SignupRequest req = makeSignupRequest("newUser", "taken@test.com", "pass");

            AllowedStudent allowed = new AllowedStudent();
            allowed.setEmail("taken@test.com");

            when(allowedStudentRepository.findByEmail("taken@test.com")).thenReturn(Optional.of(allowed));
            when(userRepository.existsByUsername("newUser")).thenReturn(false);
            when(userRepository.existsByEmail("taken@test.com")).thenReturn(true);

            assertThatThrownBy(() -> authService.registerUser(req))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Email");

            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Кидає RuntimeException якщо роль ROLE_USER не знайдена в БД")
        void registerUser_roleNotFound_throwsException() {
            SignupRequest req = makeSignupRequest("student01", "student@test.com", "pass");

            AllowedStudent allowed = new AllowedStudent();
            allowed.setEmail("student@test.com");

            when(allowedStudentRepository.findByEmail("student@test.com")).thenReturn(Optional.of(allowed));
            when(userRepository.existsByUsername("student01")).thenReturn(false);
            when(userRepository.existsByEmail("student@test.com")).thenReturn(false);
            when(encoder.encode("pass")).thenReturn("$hash$");

            assertThatThrownBy(() -> authService.registerUser(req))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("ROLE_USER");

            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Пароль зберігається у хешованому вигляді (не plain-text)")
        void registerUser_passwordIsHashed() {
            SignupRequest req = makeSignupRequest("student01", "student@test.com", "myPlainPassword");

            AllowedStudent allowed = new AllowedStudent();
            allowed.setEmail("student@test.com");
            Role userRole = new Role();
            userRole.setName(ERole.ROLE_USER);

            when(allowedStudentRepository.findByEmail("student@test.com")).thenReturn(Optional.of(allowed));
            when(userRepository.existsByUsername("student01")).thenReturn(false);
            when(userRepository.existsByEmail("student@test.com")).thenReturn(false);
            when(encoder.encode("myPlainPassword")).thenReturn("$bcrypt$hashed$");
            when(roleRepository.findByName(ERole.ROLE_USER)).thenReturn(Optional.of(userRole));

            authService.registerUser(req);

            verify(encoder, times(1)).encode("myPlainPassword");

            verify(userRepository).save(argThat(user ->
                    !user.getPassword().equals("myPlainPassword") &&
                    user.getPassword().equals("$bcrypt$hashed$")
            ));
        }
    }
}