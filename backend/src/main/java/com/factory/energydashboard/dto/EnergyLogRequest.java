package com.factory.energydashboard.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class EnergyLogRequest {

    @NotBlank(message = "Machine ID is required")
    private String machineId;

    @NotBlank(message = "Machine Name is required")
    private String machineName;

    @NotBlank(message = "Production Line is required")
    private String productionLine;

    @NotNull(message = "Power consumption is required")
    @Positive(message = "Power consumption must be positive")
    private Double powerConsumptionKW;

    @NotNull(message = "Voltage is required")
    @Positive(message = "Voltage must be positive")
    private Double voltageV;

    @NotNull(message = "Current is required")
    @Positive(message = "Current must be positive")
    private Double currentA;

    @NotNull(message = "Power Factor is required")
    @DecimalMin(value = "0.0", message = "Power factor cannot be less than 0.0")
    @DecimalMax(value = "1.0", message = "Power factor cannot exceed 1.0")
    private Double powerFactor;

    private String recordedBy = "SYSTEM_INGESTION";
}
