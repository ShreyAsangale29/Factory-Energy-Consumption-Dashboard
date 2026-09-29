# Week 1: Problem Definition and Scope
## Factory Energy Consumption Dashboard

---

## 1. Background & Executive Summary
Modern manufacturing facilities operate heavy electrical machinery (stamping presses, robotic assembly lines, industrial HVAC, compressers, arc furnaces) consuming hundreds of megawatt-hours (MWh) daily. In traditional factories, energy monitoring is performed retroactively through monthly utility bills. This lack of real-time visibility leads to:
- Unplanned peak-demand surges incurring heavy utility penalty tariffs.
- Undetected equipment degradation causing abnormally high power draws prior to mechanical failure.
- Inability to attribute energy costs accurately to specific production lines or product batches.
- Excessive carbon emissions conflicting with Enterprise Sustainability (ESG) compliance.

The **Factory Energy Consumption Dashboard** is designed to provide real-time monitoring, metric aggregation, anomaly alerting, and machine-level status drill-down to optimize energy utilization and lower operational costs.

---

## 2. Problem Statement
> **"Factory plant managers and energy engineers lack real-time visibility into machine-level power consumption, resulting in undetected energy waste, peak power penalty fees, delayed anomaly detection, and suboptimal equipment maintenance."**

### Key Pain Points:
1. **Delayed Feedback Loop**: Energy costs are discovered weeks after consumption occurred.
2. **Hidden Anomaly Spikes**: Malfunctioning motors or idling machinery consume excessive idle power undetected.
3. **Lack of Granularity**: Facilities only track overall facility power meters rather than individual production lines or machines.
4. **Manual Record-Keeping**: Energy auditors rely on paper logs and static spreadsheets, prone to human error and data latency.

---

## 3. Target Users & Stakeholders

| Stakeholder Role | Primary Objectives | Key Pain Points Addressed |
| :--- | :--- | :--- |
| **Plant Manager** | High-level facility metrics, total kWh cost tracking, ESG sustainability compliance | Lack of real-time operational dashboard, inability to forecast utility expenses |
| **Energy Auditor / Engineer** | Deep-dive telemetry inspection, power factor analysis, energy efficiency optimization | Manual spreadsheet data entry, lack of searchable historical log trends |
| **Maintenance Technician** | Immediate notification of abnormal power draws, machine health status | Equipment failure without warning, unclear diagnostic baseline data |
| **ESG / Sustainability Officer**| Carbon footprint tracking, compliance reporting, reduction target validation | Lack of audited energy metrics per production batch |
| **DevOps & System Admin** | Platform stability, real-time alert dispatch, continuous deployment, containerized isolation | High infrastructure overhead, fragile legacy monitoring software |

---

## 4. Measurable Success Criteria & Objectives

| Objective Category | Target Metric | Measurement Method |
| :--- | :--- | :--- |
| **Energy Waste Reduction** | 12% - 18% reduction in off-shift idle power | Automated baseline vs actual kWh comparison |
| **Peak Demand Mitigation** | 0 peak demand utility penalty charges | Alert threshold triggers prior to contract peak kW |
| **Mean Time to Detect (MTTD)**| < 30 seconds for energy anomaly alerts | Ingestion time to alert trigger latency |
| **Dashboard Responsiveness** | < 500ms response time for search & drill-down | Chrome DevTools & Selenium performance audit |
| **Uptime & Reliability** | 99.9% uptime for core monitoring ingestion API | Jenkins & Docker container health monitoring |

---

## 5. Constraints

### Technical Constraints:
- Legacy sensor protocols requiring standardized REST/JSON payload adapter.
- In-memory/relational storage support for low-latency queries during local deployment.
- Lightweight web architecture compatible with Docker containerization and Jenkins CI/CD pipeline.

### Operational Constraints:
- Zero disruption to active manufacturing production lines during deployment.
- Strict security controls for factory telemetry data.

---

## 6. Approved 15-Week MVP Scope

```
+-----------------------------------------------------------------------------------+
|                            15-WEEK PROJECT SCOPE                                  |
+-----------------------------------------------------------------------------------+
| [X] IN-SCOPE FOR 15-WEEK MVP (WEEKS 1-11 CORE)    | [ ] OUT-OF-SCOPE (FUTURE V2.0)|
|---------------------------------------------------+-------------------------------|
| 1. Real-time Energy Data Entry & API Ingestion     | 1. AI Predictive Maintenance  |
| 2. Searchable Energy Log Dashboard (Machine/Line) | 2. 3D Digital Twin Factory    |
| 3. Core Metrics (Total kWh, Peak kW, Power Factor)| 3. Direct Smart Meter Hardware|
| 4. Machine Status Drill-Down Detailed Modal       | 4. Multi-Tenant Cloud Billing |
| 5. Anomaly Alerting & Exception Ack View          | 5. Mobile Native App (iOS)    |
| 6. Complete CI/CD Pipeline (Jenkins + Docker)     |                               |
| 7. Automated Selenium UI Testing Suite            |                               |
+-----------------------------------------------------------------------------------+
```

---
*Document Version: 1.0.0 | Approved by Factory Steering Committee*
