package com.factory.energydashboard.repository;

import com.factory.energydashboard.model.EnergyLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnergyLogRepository extends JpaRepository<EnergyLog, Long> {

    List<EnergyLog> findByMachineIdContainingIgnoreCaseOrMachineNameContainingIgnoreCaseOrProductionLineContainingIgnoreCase(
            String machineId, String machineName, String productionLine);

    List<EnergyLog> findByMachineIdOrderByRecordedAtDesc(String machineId);

    @Query("SELECT SUM(e.powerConsumptionKW) FROM EnergyLog e")
    Double getTotalConsumptionKW();

    @Query("SELECT MAX(e.powerConsumptionKW) FROM EnergyLog e")
    Double getPeakPowerKW();

    @Query("SELECT AVG(e.powerFactor) FROM EnergyLog e")
    Double getAveragePowerFactor();
}
