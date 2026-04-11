package com.xadazhii.server.payload.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.List;

@Getter
@AllArgsConstructor
public class GradesSummaryResponse {
    private List<GradeTestInfo> tests;
    private List<StudentGradeInfo> studentGrades;
}