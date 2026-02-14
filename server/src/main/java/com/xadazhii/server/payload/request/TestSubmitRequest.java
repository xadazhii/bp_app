package com.xadazhii.server.payload.request;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Min;
import lombok.Data;

@Data
public class TestSubmitRequest {

    @NotNull
    private Long materialId;

    @NotNull
    @Min(0)
    private Integer score;
}