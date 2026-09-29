package com.factory.energydashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDTO {
    private Double totalConsumptionKWh;
    private Double peakPowerKW;
    private Long activeAlertsCount;
    private Double averagePowerFactor;
    private Double efficiencyScorePercent;
    private Long totalMachinesMonitored;
}
