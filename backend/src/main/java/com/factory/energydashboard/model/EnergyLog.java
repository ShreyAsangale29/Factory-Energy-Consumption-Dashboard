package com.factory.energydashboard.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "energy_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnergyLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "machine_id", nullable = false)
    private String machineId;

    @Column(name = "machine_name", nullable = false)
    private String machineName;

    @Column(name = "production_line", nullable = false)
    private String productionLine;

    @Column(name = "power_consumption_kw", nullable = false)
    private Double powerConsumptionKW;

    @Column(name = "voltage_v", nullable = false)
    private Double voltageV;

    @Column(name = "current_a", nullable = false)
    private Double currentA;

    @Column(name = "power_factor", nullable = false)
    private Double powerFactor;

    @Column(name = "status", nullable = false)
    private String status; // NORMAL, WARNING, CRITICAL

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt;

    @Column(name = "recorded_by")
    private String recordedBy;
}
