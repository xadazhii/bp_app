package com.xadazhii.server.services;

public final class HakeNormalizedGain {

    private HakeNormalizedGain() {
    }

    public static Double calculate(double prePercent, double postPercent) {
        if (prePercent >= 100.0) {
            return null;
        }
        return ((postPercent - prePercent) / (100.0 - prePercent)) * 100.0;
    }
}
