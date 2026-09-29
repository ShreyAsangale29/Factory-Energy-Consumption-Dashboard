package com.factory.energydashboard.controller;

import com.factory.energydashboard.dto.EnergyLogRequest;
import com.factory.energydashboard.model.EnergyLog;
import com.factory.energydashboard.service.EnergyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/energy/logs")
@CrossOrigin(origins = "*")
public class EnergyLogController {

    @Autowired
    private EnergyService energyService;

    @PostMapping
    public ResponseEntity<EnergyLog> ingestTelemetry(@Valid @RequestBody EnergyLogRequest request) {
        EnergyLog savedLog = energyService.saveEnergyLog(request);
        return new ResponseEntity<>(savedLog, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<EnergyLog>> getLogs(@RequestParam(required = false) String search) {
        if (search != null && !search.isEmpty()) {
            return ResponseEntity.ok(energyService.searchLogs(search));
        }
        return ResponseEntity.ok(energyService.getAllLogs());
    }
}
