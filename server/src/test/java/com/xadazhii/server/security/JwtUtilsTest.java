package com.xadazhii.server.security;

import com.xadazhii.server.security.details.UserDetailsImpl;
import com.xadazhii.server.security.jwt.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;

import static org.assertj.core.api.Assertions.*;

@DisplayName("JwtUtils — Unit тести")
public class JwtUtilsTest {

    private JwtUtils jwtUtils;

    private static final String SECRET = "testSecretKeyForJwtThat_IsLongEnough_For_HS512_Algorithm_1234567890";

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", SECRET);
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", EXPIRATION_MS);
    }

    private Authentication makeAuthentication(String username) {
        UserDetailsImpl userDetails = new UserDetailsImpl(1L, username, "user@test.com", "hashedPass", Collections.emptyList());
        return new UsernamePasswordAuthenticationToken(userDetails, null, Collections.emptyList());
    }

    @Test
    @DisplayName("generateJwtToken — повертає непустий рядок")
    void generateJwtToken_returnsNonEmptyString() {
        Authentication auth = makeAuthentication("student01");

        String token = jwtUtils.generateJwtToken(auth);

        assertThat(token).isNotBlank();
    }

    @Test
    @DisplayName("generateJwtToken — токен складається з 3 частин (header.payload.signature)")
    void generateJwtToken_hasThreeParts() {
        Authentication auth = makeAuthentication("student01");

        String token = jwtUtils.generateJwtToken(auth);
        String[] parts = token.split("\\.");

        assertThat(parts).hasSize(3);
    }

    @Test
    @DisplayName("getUserNameFromJwtToken — повертає правильний username")
    void getUserNameFromJwtToken_correctUsername() {
        Authentication auth = makeAuthentication("kristina_adazhii");

        String token = jwtUtils.generateJwtToken(auth);
        String username = jwtUtils.getUserNameFromJwtToken(token);

        assertThat(username).isEqualTo("kristina_adazhii");
    }

    @Test
    @DisplayName("validateJwtToken — валідний токен повертає true")
    void validateJwtToken_validToken_returnsTrue() {
        Authentication auth = makeAuthentication("student01");
        String token = jwtUtils.generateJwtToken(auth);

        assertThat(jwtUtils.validateJwtToken(token)).isTrue();
    }

    @Test
    @DisplayName("validateJwtToken — невалідний токен (сміттєвий рядок) повертає false")
    void validateJwtToken_invalidToken_returnsFalse() {
        assertThat(jwtUtils.validateJwtToken("this.is.not.a.valid.jwt")).isFalse();
    }

    @Test
    @DisplayName("validateJwtToken — порожній рядок повертає false")
    void validateJwtToken_emptyToken_returnsFalse() {
        assertThat(jwtUtils.validateJwtToken("")).isFalse();
    }

    @Test
    @DisplayName("validateJwtToken — токен підписаний іншим ключем повертає false")
    void validateJwtToken_wrongSignature_returnsFalse() {
        JwtUtils otherJwt = new JwtUtils();
        ReflectionTestUtils.setField(otherJwt, "jwtSecret", "completelyDifferentSecretKey_1234567890_XYZ");
        ReflectionTestUtils.setField(otherJwt, "jwtExpirationMs", EXPIRATION_MS);

        Authentication auth = makeAuthentication("student01");
        String tokenFromOtherKey = otherJwt.generateJwtToken(auth);

        assertThat(jwtUtils.validateJwtToken(tokenFromOtherKey)).isFalse();
    }

    @Test
    @DisplayName("validateJwtToken — прострочений токен повертає false")
    void validateJwtToken_expiredToken_returnsFalse() {
        JwtUtils expiredJwt = new JwtUtils();
        ReflectionTestUtils.setField(expiredJwt, "jwtSecret", SECRET);
        ReflectionTestUtils.setField(expiredJwt, "jwtExpirationMs", -1);

        Authentication auth = makeAuthentication("student01");
        String expiredToken = expiredJwt.generateJwtToken(auth);

        assertThat(jwtUtils.validateJwtToken(expiredToken)).isFalse();
    }
}