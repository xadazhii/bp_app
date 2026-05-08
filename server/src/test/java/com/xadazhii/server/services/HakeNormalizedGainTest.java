package com.xadazhii.server.services;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("HakeNormalizedGain — формула нормалізованого зиску")
class HakeNormalizedGainTest {

    private static final double TOLERANCE = 0.0001;

    @Test
    @DisplayName("Pre=30 %, Post=70 % → g ≈ 57,14 %")
    void typicalImprovement() {
        double g = HakeNormalizedGain.calculate(30.0, 70.0);
        assertThat(g).isCloseTo(57.1428, org.assertj.core.data.Offset.offset(TOLERANCE));
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
        assertThat(g).isNegative().isCloseTo(-50.0, org.assertj.core.data.Offset.offset(TOLERANCE));
    }

    @Test
    @DisplayName("Pre=0 %, Post=100 % → g = 100 %")
    void maximumGain() {
        assertThat(HakeNormalizedGain.calculate(0.0, 100.0)).isEqualTo(100.0);
    }

    @Test
    @DisplayName("Pre=100 % → fallback na absolútny rozdiel (žiadne delenie nulou)")
    void entryHundredPercentFallsBackToDelta() {
        assertThat(HakeNormalizedGain.calculate(100.0, 100.0)).isEqualTo(0.0);
        assertThat(HakeNormalizedGain.calculate(100.0, 80.0)).isEqualTo(-20.0);
    }
}
