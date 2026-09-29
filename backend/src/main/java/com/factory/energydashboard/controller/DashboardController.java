package com.factory.energydashboard.controller;

import com.factory.energydashboard.dto.DashboardSummaryDTO;
import com.factory.energydashboard.dto.MachineDrillDownDTO;
import com.factory.energydashboard.service.EnergyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private EnergyService energyService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDTO> getSummary() {
        return ResponseEntity.ok(energyService.getDashboardSummary());
    }

    @GetMapping("/drilldown/{machineId}")
    public ResponseEntity<MachineDrillDownDTO> getMachineDrillDown(@PathVariable String machineId) {
        MachineDrillDownDTO drillDown = energyService.getMachineDrillDown(machineId);
        if (drillDown == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(drillDown);
    }
}
