package com.factory.energydashboard.service;

import com.factory.energydashboard.dto.DashboardSummaryDTO;
import com.factory.energydashboard.dto.EnergyLogRequest;
import com.factory.energydashboard.dto.MachineDrillDownDTO;
import com.factory.energydashboard.model.Alert;
import com.factory.energydashboard.model.EnergyLog;
import com.factory.energydashboard.repository.AlertRepository;
import com.factory.energydashboard.repository.EnergyLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EnergyService {

    private static final Logger logger = LoggerFactory.getLogger(EnergyService.class);

    public static final double WARNING_THRESHOLD_KW = 160.0;
    public static final double CRITICAL_THRESHOLD_KW = 200.0;

    @Autowired
    private EnergyLogRepository energyLogRepository;

    @Autowired
    private AlertRepository alertRepository;

    public EnergyLog saveEnergyLog(EnergyLogRequest request) {
        String status = calculateStatus(request.getPowerConsumptionKW());

        EnergyLog log = new EnergyLog();
        log.setMachineId(request.getMachineId());
        log.setMachineName(request.getMachineName());
        log.setProductionLine(request.getProductionLine());
        log.setPowerConsumptionKW(request.getPowerConsumptionKW());
        log.setVoltageV(request.getVoltageV());
        log.setCurrentA(request.getCurrentA());
        log.setPowerFactor(request.getPowerFactor());
        log.setStatus(status);
        log.setRecordedAt(LocalDateTime.now());
        log.setRecordedBy(request.getRecordedBy() != null ? request.getRecordedBy() : "AUTOMATED_SENSOR");

        EnergyLog savedLog = energyLogRepository.save(log);

        // Check anomaly thresholds and create alert if necessary
        if (!"NORMAL".equalsIgnoreCase(status)) {
            triggerAlert(savedLog);
        }

        return savedLog;
    }

    public String calculateStatus(Double kw) {
        if (kw >= CRITICAL_THRESHOLD_KW) {
            return "CRITICAL";
        } else if (kw >= WARNING_THRESHOLD_KW) {
            return "WARNING";
        }
        return "NORMAL";
    }

    private void triggerAlert(EnergyLog log) {
        Alert alert = new Alert();
        alert.setMachineId(log.getMachineId());
        alert.setAlertType("POWER_SPIKE_BREACH");
        alert.setSeverity(log.getStatus());
        alert.setThresholdValue(log.getStatus().equals("CRITICAL") ? CRITICAL_THRESHOLD_KW : WARNING_THRESHOLD_KW);
        alert.setActualValue(log.getPowerConsumptionKW());
        alert.setMessage("Machine " + log.getMachineName() + " (" + log.getMachineId() + ") breached power threshold with " + log.getPowerConsumptionKW() + " kW!");
        alert.setStatus("OPEN");
        alert.setTriggeredAt(LocalDateTime.now());

        alertRepository.save(alert);
        logger.warn("[ANOMALY ALERT] Created {} alert for machine {}: {} kW", log.getStatus(), log.getMachineId(), log.getPowerConsumptionKW());
    }

    public List<EnergyLog> getAllLogs() {
        return energyLogRepository.findAll();
    }

    public List<EnergyLog> searchLogs(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllLogs();
        }
        return energyLogRepository.findByMachineIdContainingIgnoreCaseOrMachineNameContainingIgnoreCaseOrProductionLineContainingIgnoreCase(
                query, query, query);
    }

    public DashboardSummaryDTO getDashboardSummary() {
        Double totalKWh = energyLogRepository.getTotalConsumptionKW();
        Double peakKW = energyLogRepository.getPeakPowerKW();
        Double avgPF = energyLogRepository.getAveragePowerFactor();
        long activeAlerts = alertRepository.countByStatus("OPEN");

        totalKWh = (totalKWh != null) ? Math.round(totalKWh * 100.0) / 100.0 : 0.0;
        peakKW = (peakKW != null) ? Math.round(peakKW * 100.0) / 100.0 : 0.0;
        avgPF = (avgPF != null) ? Math.round(avgPF * 100.0) / 100.0 : 0.92;

        // Calculate efficiency score based on power factor and alert ratio
        double efficiencyScore = Math.min(100.0, Math.max(50.0, (avgPF * 90.0) + (10.0 - (activeAlerts * 2.0))));
        efficiencyScore = Math.round(efficiencyScore * 10.0) / 10.0;

        long monitoredMachines = energyLogRepository.findAll().stream()
                .map(EnergyLog::getMachineId)
                .distinct()
                .count();

        return new DashboardSummaryDTO(totalKWh, peakKW, activeAlerts, avgPF, efficiencyScore, monitoredMachines);
    }

    public MachineDrillDownDTO getMachineDrillDown(String machineId) {
        List<EnergyLog> history = energyLogRepository.findByMachineIdOrderByRecordedAtDesc(machineId);
        if (history.isEmpty()) {
            return null;
        }

        EnergyLog latest = history.get(0);
        double peak = history.stream().mapToDouble(EnergyLog::getPowerConsumptionKW).max().orElse(0.0);
        double avgPF = history.stream().mapToDouble(EnergyLog::getPowerFactor).average().orElse(0.9);
        double avgVoltage = history.stream().mapToDouble(EnergyLog::getVoltageV).average().orElse(400.0);

        String healthStatus = latest.getStatus();
        String advice;
        if ("CRITICAL".equalsIgnoreCase(healthStatus)) {
            advice = "Immediate Inspection Required: High power draw detected. Check motor bearing alignment and cooling vents.";
        } else if ("WARNING".equalsIgnoreCase(healthStatus)) {
            advice = "Scheduled Maintenance Recommended: Power consumption elevated above 160 kW baseline.";
        } else {
            advice = "Optimal Operating Condition: Telemetry metrics within standard energy budget parameters.";
        }

        return new MachineDrillDownDTO(
                latest.getMachineId(),
                latest.getMachineName(),
                latest.getProductionLine(),
                latest.getPowerConsumptionKW(),
                Math.round(peak * 10.0) / 10.0,
                Math.round(avgPF * 100.0) / 100.0,
                Math.round(avgVoltage * 10.0) / 10.0,
                healthStatus,
                advice,
                history
        );
    }

    public List<Alert> getAllAlerts() {
        return alertRepository.findAllByOrderByTriggeredAtDesc();
    }

    public Alert acknowledgeAlert(Long alertId) {
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found with ID: " + alertId));
        alert.setStatus("ACKNOWLEDGED");
        alert.setAcknowledgedAt(LocalDateTime.now());
        return alertRepository.save(alert);
    }
}
