package com.xadazhii.server.services;

public final class HakeNormalizedGain {

    private HakeNormalizedGain() {
    }

    public static double calculate(double entryPercent, double exitPercent) {
        if (entryPercent >= 100.0) {
            return exitPercent - 100.0;
        }
        return ((exitPercent - entryPercent) / (100.0 - entryPercent)) * 100.0;
    }
}
