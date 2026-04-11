package com.xadazhii.server.services;

import com.xadazhii.server.models.*;
import com.xadazhii.server.payload.request.TestRequest;
import com.xadazhii.server.payload.response.TestSummaryResponse;
import com.xadazhii.server.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("TestService — Unit тести")
public class TestServiceTest {

    @Mock private TestRepository testRepository;
    @Mock private QuestionRepository questionRepository;
    @Mock private AnswerRepository answerRepository;
    @Mock private TestResultRepository testResultRepository;
    @Mock private UserRepository userRepository;
    @Mock private StudentAnswerRepository studentAnswerRepository;
    @Mock private GlobalSettingsRepository globalSettingsRepository;
    @Mock private MaterialRepository materialRepository;
    @Mock private UserProgressRepository userProgressRepository;

    @InjectMocks
    private TestService testService;

    private com.xadazhii.server.models.Test makeTest(Long id, String title, Integer week) {
        com.xadazhii.server.models.Test t = new com.xadazhii.server.models.Test();
        t.setId(id);
        t.setTitle(title);
        t.setWeekNumber(week);
        return t;
    }

    private Question makeQuestion(Long id, com.xadazhii.server.models.Test test, List<Answer> answers) {
        Question q = new Question();
        q.setId(id);
        q.setQuestionText("Питання " + id);
        q.setType("CLOSED");
        q.setTest(test);
        q.setAnswers(answers);
        return q;
    }

    private Answer makeAnswer(Long id, String text, int weight) {
        Answer a = new Answer();
        a.setId(id);
        a.setAnswerText(text);
        a.setPointsWeight(weight);
        return a;
    }

    @Nested
    @DisplayName("getTests — підрахунок балів та кількості питань")
    class GetTestsScoring {

        @ParameterizedTest(name = "тиждень {0} → {1} балів за питання")
        @CsvSource({
        })
        @DisplayName("Правильна кількість балів за питання залежно від тижня")
        void pointsPerQuestion_correctByWeek(int week, int expectedPoints) {
            com.xadazhii.server.models.Test t = makeTest(1L, "Test", week);
            List<Question> questions = new ArrayList<>();
            for (int i = 0; i < 5; i++) {
                questions.add(makeQuestion((long)(i + 1), t, Collections.emptyList()));
            }
            t.setQuestions(questions);

            lenient().when(testRepository.findAllWithQuestions()).thenReturn(List.of(t));
            lenient().when(materialRepository.findAll()).thenReturn(Collections.emptyList());
            lenient().when(globalSettingsRepository.findAll()).thenReturn(Collections.emptyList());

            List<TestSummaryResponse> result = testService.getTests(true, null);

            assertThat(result).hasSize(1);
            assertThat(result.get(0).getTotalPoints()).isEqualTo(5 * expectedPoints);
        }

        @Test
        @DisplayName("Вхідний тест (тиждень 0): ліміт 25 питань, 2 бали кожне → max 50 балів для студента")
        void entryTest_studentView_capped25Questions() {
            com.xadazhii.server.models.Test t = makeTest(1L, "Vstupný test", 0);
            List<Question> questions = new ArrayList<>();
            for (int i = 0; i < 30; i++) {
                questions.add(makeQuestion((long)(i + 1), t, Collections.emptyList()));
            }
            t.setQuestions(questions);

            Long userId = 42L;
            when(testRepository.findAllWithQuestions()).thenReturn(List.of(t));
            when(materialRepository.findAll()).thenReturn(Collections.emptyList());
            when(userProgressRepository.findCompletedMaterialIdsByUserId(userId)).thenReturn(Collections.emptySet());
            when(globalSettingsRepository.findAll()).thenReturn(Collections.emptyList());

            List<TestSummaryResponse> result = testService.getTests(false, userId);

            assertThat(result).hasSize(1);
            TestSummaryResponse summary = result.get(0);
            assertThat(summary.getQuestionCount()).isEqualTo(25);
            assertThat(summary.getTotalPoints()).isEqualTo(50);
        }

        @Test
        @DisplayName("Тижневий тест (тиждень 1): ліміт 8 питань, 1 бал кожне → max 8 балів для студента")
        void weeklyTest_studentView_capped8Questions() {
            com.xadazhii.server.models.Test t = makeTest(2L, "Test 1", 1);
            List<Question> questions = new ArrayList<>();
            for (int i = 0; i < 20; i++) {
                questions.add(makeQuestion((long)(i + 1), t, Collections.emptyList()));
            }
            t.setQuestions(questions);

            Material mat = new Material();
            mat.setId(10L);
            mat.setWeekNumber(1);

            Long userId = 5L;
            when(testRepository.findAllWithQuestions()).thenReturn(List.of(t));
            when(materialRepository.findAll()).thenReturn(List.of(mat));
            when(userProgressRepository.findCompletedMaterialIdsByUserId(userId)).thenReturn(Set.of(10L));

            GlobalSettings settings = new GlobalSettings();
            settings.setSemesterStartDate(java.time.LocalDate.of(2024, 1, 1).atStartOfDay());
            when(globalSettingsRepository.findAll()).thenReturn(List.of(settings));

            List<TestSummaryResponse> result = testService.getTests(false, userId);

            assertThat(result).hasSize(1);
            assertThat(result.get(0).getQuestionCount()).isEqualTo(8);
            assertThat(result.get(0).getTotalPoints()).isEqualTo(8);
        }

        @Test
        @DisplayName("Підсумковий тест (тиждень 13): ліміт 25 питань × 2 бали → max 50 якщо питань >= 25 (admin view)")
        void finalTest_adminView_50pointsCap() {
            com.xadazhii.server.models.Test t = makeTest(5L, "Záverečný test", 13);
            List<Question> questions = new ArrayList<>();
            for (int i = 0; i < 30; i++) {
                questions.add(makeQuestion((long)(i + 1), t, Collections.emptyList()));
            }
            t.setQuestions(questions);

            when(testRepository.findAllWithQuestions()).thenReturn(List.of(t));
            when(materialRepository.findAll()).thenReturn(Collections.emptyList());

            List<TestSummaryResponse> result = testService.getTests(true, null);

            assertThat(result).hasSize(1);
            assertThat(result.get(0).getQuestionCount()).isEqualTo(30);
            assertThat(result.get(0).getTotalPoints()).isEqualTo(60);
        }

        @Test
        @DisplayName("Підсумковий тест (тиждень 13): student view із 25+ питань → ліміт 25, max 50 балів")
        void finalTest_studentView_capped25Questions() {
            com.xadazhii.server.models.Test t = makeTest(5L, "Záverečný test", 13);
            List<Question> questions = new ArrayList<>();
            for (int i = 0; i < 30; i++) {
                questions.add(makeQuestion((long)(i + 1), t, Collections.emptyList()));
            }
            t.setQuestions(questions);

            Long userId = 7L;

            Material week13Material = new Material();
            week13Material.setId(130L);
            week13Material.setWeekNumber(13);

            GlobalSettings settings = new GlobalSettings();
            settings.setSemesterStartDate(java.time.LocalDate.of(2020, 1, 1).atStartOfDay());

            when(testRepository.findAllWithQuestions()).thenReturn(List.of(t));
            when(materialRepository.findAll()).thenReturn(List.of(week13Material));
            when(userProgressRepository.findCompletedMaterialIdsByUserId(userId)).thenReturn(Set.of(130L));
            when(globalSettingsRepository.findAll()).thenReturn(List.of(settings));

            List<TestSummaryResponse> result = testService.getTests(false, userId);

            assertThat(result).hasSize(1);
            assertThat(result.get(0).getQuestionCount()).isEqualTo(25);
            assertThat(result.get(0).getTotalPoints()).isEqualTo(50);
        }

        @Test
        @DisplayName("Адмін view (all=true): повертає ВСІ питання без ліміту")
        void adminView_allTestsReturned_noLimit() {
            com.xadazhii.server.models.Test t = makeTest(1L, "Test", 0);
            List<Question> questions = new ArrayList<>();
            for (int i = 0; i < 40; i++) {
                questions.add(makeQuestion((long)(i + 1), t, Collections.emptyList()));
            }
            t.setQuestions(questions);

            when(testRepository.findAllWithQuestions()).thenReturn(List.of(t));
            when(materialRepository.findAll()).thenReturn(Collections.emptyList());

            List<TestSummaryResponse> result = testService.getTests(true, null);

            assertThat(result.get(0).getQuestionCount()).isEqualTo(40);
            assertThat(result.get(0).getTotalPoints()).isEqualTo(80);
        }
    }

    @Nested
    @DisplayName("createTest — створення тесту")
    class CreateTest {

        @Test
        @DisplayName("Успішне збереження нового тесту")
        void createTest_success() {
            TestRequest req = new TestRequest();
            req.setTitle("Новий тест");
            req.setWeekNumber(3);
            req.setQuestions(Collections.emptyList());

            com.xadazhii.server.models.Test saved = makeTest(99L, "Новий тест", 3);
            when(testRepository.save(any())).thenReturn(saved);

            com.xadazhii.server.models.Test result = testService.createTest(req);

            assertThat(result.getId()).isEqualTo(99L);
            assertThat(result.getTitle()).isEqualTo("Новий тест");
            verify(testRepository, times(1)).save(any());
        }

        @Test
        @DisplayName("NullPointerException при null request")
        void createTest_nullRequest_throwsNPE() {
            assertThatThrownBy(() -> testService.createTest(null))
                    .isInstanceOf(NullPointerException.class);
        }
    }

    @Nested
    @DisplayName("deleteTest — видалення тесту")
    class DeleteTest {

        @Test
        @DisplayName("Видалення тесту зменшує бали студента")
        void deleteTest_reducesStudentPoints() {
            com.xadazhii.server.models.Test t = makeTest(1L, "Test", 1);

            User student = new User();
            student.setId(10L);
            student.setPoints(30);

            TestResult result = new TestResult();
            result.setStudent(student);
            result.setTest(t);
            result.setScore(10);

            when(testRepository.findById(1L)).thenReturn(Optional.of(t));
            when(testResultRepository.findByTestId(1L)).thenReturn(List.of(result));

            testService.deleteTest(1L);

            assertThat(student.getPoints()).isEqualTo(20);
            verify(userRepository).save(student);
            verify(testRepository).delete(t);
        }

        @Test
        @DisplayName("NoSuchElementException якщо тест не знайдено")
        void deleteTest_notFound_throwsException() {
            when(testRepository.findById(999L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> testService.deleteTest(999L))
                    .isInstanceOf(NoSuchElementException.class)
                    .hasMessageContaining("999");
        }

        @Test
        @DisplayName("Бали студента не опускаються нижче 0")
        void deleteTest_studentPointsNeverGoNegative() {
            com.xadazhii.server.models.Test t = makeTest(1L, "Test", 1);

            User student = new User();
            student.setId(10L);

            TestResult result = new TestResult();
            result.setStudent(student);
            result.setTest(t);
            result.setScore(20);

            when(testRepository.findById(1L)).thenReturn(Optional.of(t));
            when(testResultRepository.findByTestId(1L)).thenReturn(List.of(result));

            testService.deleteTest(1L);

        }
    }

    @Nested
    @DisplayName("toggleCheatStatus — переключення статусу списування")
    class ToggleCheatStatus {

        @Test
        @DisplayName("Якщо позначено як список → score стає 0, бали студента зменшуються")
        void toggleCheat_markAsCheated_scoreBecomesZero() {
            User student = new User();
            student.setId(1L);
            student.setPoints(50);

            com.xadazhii.server.models.Test t = makeTest(1L, "Test", 1);

            TestResult result = new TestResult();
            result.setId(1L);
            result.setStudent(student);
            result.setTest(t);
            result.setScore(10);
            result.setSubmittedAnswers(new ArrayList<>());

            when(testResultRepository.findById(1L)).thenReturn(Optional.of(result));

            testService.toggleCheatStatus(1L);

            assertThat(result.isCheated()).isTrue();
            assertThat(result.getScore()).isEqualTo(0);
        }

        @Test
        @DisplayName("Якщо зняти позначку списування → бали повертаються")
        void toggleCheat_removeCheated_pointsRestored() {
            User student = new User();
            student.setId(1L);
            student.setPoints(20);

            com.xadazhii.server.models.Test t = makeTest(1L, "Test", 1);

            StudentAnswer sa = new StudentAnswer();
            sa.setCorrect(true);
            sa.setEarnedPoints(5);
            sa.setSelectedAnswers(Collections.emptyList());
            Question q = new Question();
            q.setType("CLOSED");
            sa.setQuestion(q);

            TestResult result = new TestResult();
            result.setId(2L);
            result.setStudent(student);
            result.setTest(t);
            result.setCheated(true);
            result.setSubmittedAnswers(List.of(sa));

            when(testResultRepository.findById(2L)).thenReturn(Optional.of(result));

            testService.toggleCheatStatus(2L);

            assertThat(result.isCheated()).isFalse();
            assertThat(result.getScore()).isEqualTo(5);
        }
    }

    @Nested
    @DisplayName("getTestDetail — деталі тесту")
    class GetTestDetail {

        @Test
        @DisplayName("NoSuchElementException якщо тест не знайдено")
        void getTestDetail_notFound_throwsException() {
            when(testRepository.findById(77L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> testService.getTestDetail(77L, true, null))
                    .isInstanceOf(NoSuchElementException.class)
                    .hasMessageContaining("77");
        }

        @Test
        @DisplayName("Повертає правильну структуру відповіді")
        void getTestDetail_returnsCorrectStructure() {
            com.xadazhii.server.models.Test t = makeTest(1L, "Vstupný test", 0);
            Answer answer = makeAnswer(1L, "Відповідь А", 2);
            Question q = makeQuestion(1L, t, List.of(answer));
            t.setQuestions(List.of(q));

            when(testRepository.findById(1L)).thenReturn(Optional.of(t));

            Map<String, Object> detail = testService.getTestDetail(1L, true, null);

            assertThat(detail).containsKey("id");
            assertThat(detail).containsKey("title");
            assertThat(detail).containsKey("questions");
            assertThat(detail.get("title")).isEqualTo("Vstupný test");

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> questions = (List<Map<String, Object>>) detail.get("questions");
            assertThat(questions).hasSize(1);
            assertThat(questions.get(0).get("points")).isEqualTo(2);
        }
    }

    @Nested
    @DisplayName("Автоматичні назви тестів при імпорті")
    class AutoTitle {

        @ParameterizedTest(name = "тиждень {0} → назва '{1}'")
        @CsvSource({
                "0,  Vstupný test",
                "1,  Test 1",
                "12, Test 12",
                "13, Záverečný test",
        })
        @DisplayName("createTest зберігає правильну назву залежно від тижня")
        void createTest_correctTitleForWeek(int week, String expectedTitle) {
            TestRequest req = new TestRequest();
            req.setTitle("Тест тижня " + week);
            req.setWeekNumber(week);
            req.setQuestions(Collections.emptyList());

            com.xadazhii.server.models.Test saved = makeTest(1L, req.getTitle(), week);
            when(testRepository.save(any())).thenReturn(saved);

            com.xadazhii.server.models.Test result = testService.createTest(req);

            assertThat(result.getWeekNumber()).isEqualTo(week);
            verify(testRepository).save(any());
        }
    }
}