# Week 5: Feature Development with Branching Workflow
## Factory Energy Consumption Dashboard

---

## 1. Core Feature 1 Definition
- **Feature Name**: `feature/energy-data-ingestion`
- **Objective**: Implement the baseline REST telemetry ingestion controller, validation rules, anomaly threshold logic, and H2 database persistence.
- **Scope**:
  - `EnergyLog.java` entity model.
  - `EnergyLogRepository.java` interface.
  - `EnergyService.java` business logic with threshold checks (> 150 kW = WARNING, > 200 kW = CRITICAL).
  - `EnergyLogController.java` with `/api/v1/energy/logs` endpoint.

---

## 2. Git Branching Execution Trace

```bash
# 1. Create and switch to feature branch off develop
git checkout develop
git checkout -b feature/energy-data-ingestion

# 2. Implement entity, service, and controller classes
# [Created EnergyLog.java, EnergyService.java, EnergyLogController.java]

# 3. Stage changes and inspect git status
git add backend/src/main/java/com/factory/energydashboard/
git status

# 4. Commit changes using conventional commit message
git commit -m "feat(ingestion): implement REST controller and validation for energy telemetry ingestion"

# 5. Push feature branch to origin remote repository
git push origin feature/energy-data-ingestion
```

---

## 3. Pull Request Details & Peer Review

### Pull Request Summary
- **PR Title**: `[PR #1] Feature: Telemetry Ingestion API & Automatic Anomaly Detection`
- **Source Branch**: `feature/energy-data-ingestion`
- **Target Branch**: `develop`

### Code Review Comments & Resolution Log

```
+-----------------------------------------------------------------------------------+
| CODE REVIEW DISCUSSION LOG                                                        |
+-----------------------------------------------------------------------------------+
| Reviewer (Lead Architect):                                                       |
| "Great work on the REST endpoint! Please ensure that powerFactor is validated    |
| to be between 0.0 and 1.0, and add explicit threshold logging when power          |
| consumption exceeds 200 kW."                                                      |
|                                                                                   |
| Developer Response:                                                               |
| "Added @DecimalMin(0.0) and @DecimalMax(1.0) validation constraints to            |
| EnergyLogRequest payload and implemented Logger.warn() triggers in EnergyService." |
+-----------------------------------------------------------------------------------+
```

---

## 4. Pull Request Merge Evidence

```bash
# Merge process onto develop branch
git checkout develop
git merge --no-ff feature/energy-data-ingestion -m "merge: pull request #1 from feature/energy-data-ingestion into develop"
git branch -d feature/energy-data-ingestion
```

### Git Log Verification Transcript
```
*   commit 9a8f7e2 (HEAD -> develop)
|\  Merge: 4b3c2d1 1a2b3c4
| | Author: Developer <dev@factory-energy.com>
| | Date:   Mon Sep 28 14:20:00 2026
| | 
| |     merge: pull request #1 from feature/energy-data-ingestion into develop
| | 
| * commit 1a2b3c4 (feature/energy-data-ingestion)
| | Author: Developer <dev@factory-energy.com>
| | Date:   Mon Sep 28 14:15:00 2026
| | 
| |     feat(ingestion): implement REST controller and validation for energy telemetry ingestion
```

---
*Document Version: 1.0.0 | Author: Development Team*
