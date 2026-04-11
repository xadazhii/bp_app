package com.xadazhii.server.services;

import com.xadazhii.server.models.*;
import com.xadazhii.server.payload.response.GradesSummaryResponse;
import com.xadazhii.server.repository.TestRepository;
import com.xadazhii.server.repository.TestResultRepository;
import com.xadazhii.server.repository.UserProgressRepository;
import com.xadazhii.server.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.nio.charset.StandardCharsets;
import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("GradesService — Unit тести")
public class GradesServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private TestRepository testRepository;
    @Mock private TestResultRepository testResultRepository;
    @Mock private UserProgressRepository userProgressRepository;

    @InjectMocks
    private GradesService gradesService;

    private User makeStudent(Long id, String username, String email, String pseudonym, int basePoints) {
        User u = new User();
        u.setId(id);
        u.setUsername(username);
        u.setEmail(email);
        u.setPseudonym(pseudonym);
        u.setPoints(basePoints);
        Role r = new Role();
        r.setName(ERole.ROLE_USER);
        u.setRoles(Set.of(r));
        return u;
    }

    private com.xadazhii.server.models.Test makeTest(Long id, String title) {
        com.xadazhii.server.models.Test t = new com.xadazhii.server.models.Test();
        t.setId(id);
        t.setTitle(title);
        return t;
    }

    private TestResult makeResult(Long id, User student, com.xadazhii.server.models.Test test, int score, boolean cheated) {
        TestResult r = new TestResult();
        r.setId(id);
        r.setStudent(student);
        r.setTest(test);
        r.setScore(score);
        r.setCheated(cheated);
        return r;
    }

    @Nested
    @DisplayName("getLeaderboard — розрахунок рейтингу")
    class LeaderboardTests {

        @Test
        @DisplayName("Розраховує загальні бали: тести + навчальні матеріали")
        void leaderboard_calculatesCorrectTotal() {
            User s1 = makeStudent(1L, "student1", "s1@test.com", null, 0);

            com.xadazhii.server.models.Test t1 = makeTest(10L, "Test 1");
            TestResult r1 = makeResult(100L, s1, t1, 15, false);

            when(userRepository.findAll()).thenReturn(List.of(s1));
            when(testResultRepository.findAll()).thenReturn(List.of(r1));

            List<Object[]> learning = List.of(
                new Object[]{1L, "lecture", 2L},
                new Object[]{1L, "seminar", 1L}
            );
            when(userProgressRepository.countCompletedLearningMaterialsByUserAndType()).thenReturn(learning);

            assertThat(result).hasSize(1);
            Map<String, Object> map = result.get(0);
            assertThat(map.get("points")).isEqualTo(22);
            assertThat(map.get("testPoints")).isEqualTo(15);
            assertThat(map.get("learningPoints")).isEqualTo(7);
        }

        @Test
        @DisplayName("Використовує псевдонім якщо він заданий")
        void leaderboard_usesPseudonym() {
            User s1 = makeStudent(1L, "real_name", "s1@test.com", "CoolGhost", 0);
            when(userRepository.findAll()).thenReturn(List.of(s1));
            when(testResultRepository.findAll()).thenReturn(Collections.emptyList());
            when(userProgressRepository.countCompletedLearningMaterialsByUserAndType()).thenReturn(Collections.emptyList());

            List<Map<String, Object>> result = gradesService.getLeaderboard(2L);

            assertThat(result.get(0).get("username")).isEqualTo("CoolGhost");
        }

        @Test
        @DisplayName("Сортує за спаданням балів")
        void leaderboard_sortsByPointsDescending() {
            User s1 = makeStudent(1L, "S1", "s1@t.c", null, 0);
            User s2 = makeStudent(2L, "S2", "s2@t.c", null, 0);

            when(userRepository.findAll()).thenReturn(List.of(s1, s2));
            when(testResultRepository.findAll()).thenReturn(Collections.emptyList());

            List<Object[]> learning = List.of(
            );
            when(userProgressRepository.countCompletedLearningMaterialsByUserAndType()).thenReturn(learning);

            List<Map<String, Object>> result = gradesService.getLeaderboard(null);

            assertThat(result).hasSize(2);
            assertThat(result.get(0).get("points")).isEqualTo(20);
            assertThat(result.get(1).get("points")).isEqualTo(10);
        }

        @Test
        @DisplayName("Позначає поточного користувача суфіксом (Vy)")
        void leaderboard_highlightsCurrentUser() {
            User s1 = makeStudent(1L, "Me", "me@t.c", null, 0);
            when(userRepository.findAll()).thenReturn(List.of(s1));
            when(testResultRepository.findAll()).thenReturn(Collections.emptyList());
            when(userProgressRepository.countCompletedLearningMaterialsByUserAndType()).thenReturn(Collections.emptyList());

            assertThat(result.get(0).get("username")).asString().contains("(Vy)");
            assertThat(result.get(0).get("isCurrentUser")).isEqualTo(true);
        }
    }

    @Nested
    @DisplayName("getGradesSummary — зведена таблиця для адміна")
    class GradesSummaryTests {

        @Test
        @DisplayName("Повертає інформацію про всі тести та студенти")
        void gradesSummary_returnsAllData() {
            User s1 = makeStudent(1L, "Student1", "s1@t.c", null, 0);
            com.xadazhii.server.models.Test t1 = makeTest(10L, "Week 1 Test");
            TestResult r1 = makeResult(100L, s1, t1, 8, false);

            when(userRepository.findAll()).thenReturn(List.of(s1));
            when(testRepository.findAll()).thenReturn(List.of(t1));
            when(testResultRepository.findAll()).thenReturn(List.of(r1));

            GradesSummaryResponse resp = gradesService.getGradesSummary();

            assertThat(resp.getTests()).hasSize(1);
            assertThat(resp.getStudentGrades()).hasSize(1);
            assertThat(resp.getStudentGrades().get(0).getScores()).containsEntry(10L, 8);
        }
    }

    @Test
    @DisplayName("exportGradesToCsv — генерує валідний CSV з BOM")
    void exportGrades_generatesCorrectCsv() {
        User s1 = makeStudent(1L, "S1", "s1@test.com", null, 0);
        com.xadazhii.server.models.Test t1 = makeTest(10L, "Final Exam");
        TestResult r1 = makeResult(100L, s1, t1, 45, false);

        when(userRepository.findAll()).thenReturn(List.of(s1));
        when(testResultRepository.findAll()).thenReturn(List.of(r1));

        byte[] csvBytes = gradesService.exportGradesToCsv();
        String content = new String(csvBytes, StandardCharsets.UTF_8);

        assertThat(content).contains("\ufeffE-mail;Názov testu;Dosiahnuté body");
        assertThat(content).contains("s1@test.com;Final Exam;45");
    }
}