package com.factory.energydashboard.config;

import com.factory.energydashboard.dto.EnergyLogRequest;
import com.factory.energydashboard.service.EnergyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private EnergyService energyService;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("[DATA INITIALIZER] Seeding Factory Energy Consumption initial dataset...");

        createLog("M-PRESS-101", "Heavy Hydraulic Stamping Press 101", "Stamping Line A", 145.5, 415.0, 210.0, 0.94);
        createLog("M-PRESS-101", "Heavy Hydraulic Stamping Press 101", "Stamping Line A", 168.0, 412.0, 240.0, 0.91); // Trigger Warning

        createLog("M-ROBOT-202", "6-Axis Robotic Welder 202", "Assembly Line B", 95.2, 400.0, 140.0, 0.96);
        createLog("M-ROBOT-202", "6-Axis Robotic Welder 202", "Assembly Line B", 112.4, 398.0, 160.0, 0.95);

        createLog("M-FURNACE-303", "Induction Metal Furnace 303", "Smelting & Foundry Line C", 215.0, 440.0, 310.0, 0.88); // Trigger Critical
        createLog("M-FURNACE-303", "Induction Metal Furnace 303", "Smelting & Foundry Line C", 205.8, 438.0, 300.0, 0.89); // Trigger Critical

        createLog("M-PACK-404", "Automated Conveyor Packaging Line 404", "Packaging Line D", 45.0, 380.0, 70.0, 0.98);
        createLog("M-HVAC-505", "Industrial Centrifugal Chilled HVAC 505", "Facility Infrastructure", 175.0, 410.0, 250.0, 0.90); // Trigger Warning

        System.out.println("[DATA INITIALIZER] Seed completed successfully!");
    }

    private void createLog(String machineId, String machineName, String line, double kw, double v, double a, double pf) {
        EnergyLogRequest req = new EnergyLogRequest();
        req.setMachineId(machineId);
        req.setMachineName(machineName);
        req.setProductionLine(line);
        req.setPowerConsumptionKW(kw);
        req.setVoltageV(v);
        req.setCurrentA(a);
        req.setPowerFactor(pf);
        req.setRecordedBy("SENSOR_GATEWAY_INIT");
        energyService.saveEnergyLog(req);
    }
}
