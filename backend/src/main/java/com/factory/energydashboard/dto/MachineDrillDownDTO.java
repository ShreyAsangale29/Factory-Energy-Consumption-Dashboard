package com.factory.energydashboard.dto;

import com.factory.energydashboard.model.EnergyLog;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MachineDrillDownDTO {
    private String machineId;
    private String machineName;
    private String productionLine;
    private Double currentPowerKW;
    private Double peakPowerKW;
    private Double avgPowerFactor;
    private Double avgVoltageV;
    private String healthStatus;
    private String maintenanceAdvice;
    private List<EnergyLog> telemetryHistory;
}
