package com.xadazhii.server.services;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.assertj.core.data.Offset;

import static com.xadazhii.server.services.HakeNormalizedGain.Classification.*;
import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("HakeNormalizedGain — формула нормалізованого зиску")
class HakeNormalizedGainTest {

    private static final Offset<Double> TOLERANCE = Offset.offset(0.0001);

    @Nested
    @DisplayName("calculate — výpočet hodnoty zisku")
    class CalculateTests {

        @Test
        @DisplayName("Pre=30 %, Post=70 % → g ≈ 57,14 %")
        void typicalImprovement() {
            double g = HakeNormalizedGain.calculate(30.0, 70.0);
            assertThat(g).isCloseTo(57.1428, TOLERANCE);
        }

        @Test
        @DisplayName("Pre=Post → g = 0")
        void noChange() {
            assertThat(HakeNormalizedGain.calculate(50.0, 50.0)).isEqualTo(0.0);
        }

        @Test
        @DisplayName("Post < Pre → záporný zisk")
        void regression() {
            double g = HakeNormalizedGain.calculate(60.0, 40.0);
            assertThat(g).isNegative().isCloseTo(-50.0, TOLERANCE);
        }

        @Test
        @DisplayName("Pre=0 %, Post=100 % → g = 100 %")
        void maximumGain() {
            assertThat(HakeNormalizedGain.calculate(0.0, 100.0)).isEqualTo(100.0);
        }

        @Test
        @DisplayName("Pre=100 % → absolútny rozdiel (zachytenie regresie po dosiahnutí maxima)")
        void entryHundredPercentReturnsAbsoluteDelta() {
            assertThat(HakeNormalizedGain.calculate(100.0, 100.0)).isEqualTo(0.0);
            assertThat(HakeNormalizedGain.calculate(100.0, 80.0)).isEqualTo(-20.0);
        }
    }

    @Nested
    @DisplayName("classify — kategorizácia podľa Hakeho prahov")
    class ClassifyTests {

        @Test
        @DisplayName("g < 0 → REGRESSION")
        void negativeGainIsRegression() {
            assertThat(HakeNormalizedGain.classify(-5.0)).isEqualTo(REGRESSION);
            assertThat(HakeNormalizedGain.classify(-50.0)).isEqualTo(REGRESSION);
        }

        @Test
        @DisplayName("0 ≤ g < 30 → LOW")
        void lowGainBucket() {
            assertThat(HakeNormalizedGain.classify(0.0)).isEqualTo(LOW);
            assertThat(HakeNormalizedGain.classify(15.0)).isEqualTo(LOW);
            assertThat(HakeNormalizedGain.classify(29.999)).isEqualTo(LOW);
        }

        @Test
        @DisplayName("30 ≤ g < 70 → MEDIUM")
        void mediumGainBucket() {
            assertThat(HakeNormalizedGain.classify(30.0)).isEqualTo(MEDIUM);
            assertThat(HakeNormalizedGain.classify(48.0)).isEqualTo(MEDIUM);
            assertThat(HakeNormalizedGain.classify(69.999)).isEqualTo(MEDIUM);
        }

        @Test
        @DisplayName("g ≥ 70 → HIGH")
        void highGainBucket() {
            assertThat(HakeNormalizedGain.classify(70.0)).isEqualTo(HIGH);
            assertThat(HakeNormalizedGain.classify(85.0)).isEqualTo(HIGH);
            assertThat(HakeNormalizedGain.classify(100.0)).isEqualTo(HIGH);
        }
    }
}
