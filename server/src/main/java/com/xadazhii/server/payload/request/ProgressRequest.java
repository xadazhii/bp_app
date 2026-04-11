package com.xadazhii.server.payload.request;

import javax.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProgressRequest {
    @NotNull
    private Long materialId;
}