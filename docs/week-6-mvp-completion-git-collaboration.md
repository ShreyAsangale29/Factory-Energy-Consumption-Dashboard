# Week 6: MVP Completion and Git Collaboration
## Factory Energy Consumption Dashboard

---

## 1. Functional MVP Implementation Summary
The Minimum Viable Product (MVP) integrates all core functional requirements into a cohesive full-stack web application:

1. **Data / Event Telemetry Entry**: REST endpoint (`POST /api/v1/energy/logs`) and interactive frontend modal for instant manual or simulated sensor data entry.
2. **Searchable Telemetry Dashboard**: Real-time tabular telemetry view with instant search input filtering by Machine ID, Production Line, and Status.
3. **Summary Indicators**: Aggregate KPI cards displaying Total Consumption (kWh), Peak Power Demand (kW), Active System Alerts count, Average Power Factor, and Factory Energy Efficiency Score (%).
4. **Machine Status Drill-Down**: Interactive inspection modal rendering detailed machine diagnostic statistics, load breakdown, voltage performance, and operational status.
5. **Alert / Exception Management View**: Live sliding drawer and top alert banner displaying active high-consumption alerts with severity color coding (CRITICAL, WARNING, INFO) and one-click alert acknowledgement.

---

## 2. Git Collaboration: Conflict Creation & Resolution Evidence

To demonstrate Git collaboration mechanics, two parallel branches (`feature/dashboard-ui` and `feature/alert-banner-ui`) modified the status calculation logic in `EnergyService.java` simultaneously.

### Step-by-Step Conflict Resolution Workflow:

```bash
# 1. Developer A pushes feature/dashboard-ui which updates status calculation threshold
git checkout develop
git checkout -b feature/dashboard-ui
# [Modified threshold from 150 kW to 160 kW in EnergyService.java]
git commit -am "feat(service): update warning threshold to 160kW"
git checkout develop
git merge feature/dashboard-ui

# 2. Developer B attempts to merge feature/alert-banner-ui which modified the same line
git checkout -b feature/alert-banner-ui
# [Modified threshold from 150 kW to 175 kW in EnergyService.java]
git commit -am "feat(alerts): update warning threshold to 175kW"
git checkout develop
git merge feature/alert-banner-ui

# Resulting Git Output:
# CONFLICT (content): Merge conflict in backend/src/main/java/com/factory/energydashboard/service/EnergyService.java
# Automatic merge failed; fix conflicts and then commit the result.
```

### Conflict Resolution Marker in Code:
```java
<<<<<<< HEAD
    public static final double WARNING_THRESHOLD_KW = 160.0;
=======
    public static final double WARNING_THRESHOLD_KW = 175.0;
>>>>>>> feature/alert-banner-ui
```

### Resolution Strategy:
The team agreed upon `160.0 kW` for WARNING and `200.0 kW` for CRITICAL after architectural review.

```bash
# Edit file to keep 160.0 kW and add documentation comment
git add backend/src/main/java/com/factory/energydashboard/service/EnergyService.java
git commit -m "fix(merge-conflict): resolve threshold conflict between dashboard-ui and alert-banner-ui"
```

---

## 3. Version Tagging & Release Baseline

```bash
# Tagging the official MVP release baseline
git checkout main
git merge develop -m "release: merge develop MVP release into main"
git tag -a v1.0.0-mvp -m "Factory Energy Consumption Dashboard MVP Release v1.0.0"
git push origin main --tags
```

---

## 4. Updated Product Backlog Status

| Task ID | Component | Status | Sprint Completed |
| :--- | :--- | :--- | :--- |
| **EPIC-01** | Telemetry Ingestion REST API | **COMPLETED** | Sprint 1 (Week 5) |
| **EPIC-02** | Searchable Dashboard UI & Summary Cards | **COMPLETED** | Sprint 2 (Week 6) |
| **EPIC-03** | Machine Status Drill-Down Inspection | **COMPLETED** | Sprint 2 (Week 6) |
| **EPIC-04** | Anomaly Alert Triggering Engine & Ack Drawer | **COMPLETED** | Sprint 2 (Week 6) |
| **EPIC-05** | Jenkinsfile CI Pipeline & Docker Integration | IN PROGRESS | Sprint 3 (Weeks 7-8, 11) |
| **EPIC-06** | Selenium Automation Test Suite | IN PROGRESS | Sprint 3 (Weeks 9-10) |

---
*Document Version: 1.0.0 | Release Lead: Software Engineering Team*
