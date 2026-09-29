package com.factory.energydashboard.repository;

import com.factory.energydashboard.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByStatus(String status);
    long countByStatus(String status);
    List<Alert> findAllByOrderByTriggeredAtDesc();
}
