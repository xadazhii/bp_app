package com.xadazhii.server.services;

public final class HakeNormalizedGain {

    public enum Classification {
        REGRESSION,
        LOW,
        MEDIUM,
        HIGH
    }

    private HakeNormalizedGain() {
    }

    public static double calculate(double entryPercent, double exitPercent) {
        if (entryPercent >= 100.0) {
            return exitPercent - 100.0;
        }
        return ((exitPercent - entryPercent) / (100.0 - entryPercent)) * 100.0;
    }

    public static Classification classify(double gainPercent) {
        if (gainPercent < 0.0) return Classification.REGRESSION;
        if (gainPercent < 30.0) return Classification.LOW;
        if (gainPercent < 70.0) return Classification.MEDIUM;
        return Classification.HIGH;
    }
}
