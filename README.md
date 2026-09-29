# Factory Energy Consumption Dashboard
> Real-Time Industrial IoT Telemetry Monitoring, Anomaly Exception Engine, CI/CD Pipeline & Containerized Deployment

---

## 📌 Project Overview
The **Factory Energy Consumption Dashboard** is an enterprise-grade full-stack web application designed for manufacturing plant managers, energy auditors, and maintenance engineers to monitor real-time machine-level power consumption (kW), voltage (V), current (A), and power factor (PF). It features an automated anomaly threshold engine that triggers high-consumption alerts, a searchable telemetry table, machine drill-down analytics, and complete DevOps CI/CD pipeline integration.

---

## 📂 15-Week Multi-Phase Roadmap & Sitemap

| Week | Phase / Focus | Deliverables & Documentation Link | Key Artifacts |
| :--- | :--- | :--- | :--- |
| **Week 1** | **Problem Definition & Scope** | [Week 1 Scope Document](docs/week-1-problem-definition-and-scope.md) | Problem statement, stakeholder list, success metrics, MVP scope freeze |
| **Week 2** | **Agile Planning & DevOps Workflow** | [Week 2 Agile Plan Document](docs/week-2-agile-planning-and-devops-workflow.md) | User stories, Gherkin criteria, product backlog, Definition of Done, DevOps lifecycle |
| **Week 3** | **Architecture & Tech Setup** | [Week 3 Architecture Document](docs/week-3-requirements-architecture-tech-setup.md) | SRS summary, use-case diagram, multi-tier architecture, ER schema & REST API list |
| **Week 4** | **Git & GitHub Repo Initialization** | [Week 4 Repository Document](docs/week-4-git-github-repository-initialization.md) | `.gitignore`, Issue templates (`.github/`), PR template, branch rules & commit policy |
| **Week 5** | **Feature Development with Branching** | [Week 5 Feature 1 Document](docs/week-5-feature-development-with-branching.md) | Feature branch `feature/energy-data-ingestion`, REST ingestion API, PR review log |
| **Week 6** | **MVP Completion & Git Collaboration** | [Week 6 MVP Document](docs/week-6-mvp-completion-git-collaboration.md) | Full MVP dashboard, conflict creation & resolution evidence, `v1.0.0-mvp` tag |
| **Week 7** | **Jenkins Installation & CI Job** | [Week 7 Jenkins CI Document](docs/week-7-jenkins-installation-ci-job.md) | Jenkins setup guide, `build-job-config.xml`, SCM trigger evidence, archived build JAR |
| **Week 8** | **Pipeline as Code & Server Deploy** | [Week 8 Pipeline Document](docs/week-8-pipeline-as-code-server-deployment.md) | `Jenkinsfile` declarative pipeline, parameterized environment settings, server deploy |
| **Week 9** | **Selenium Test Design & Local Run** | [Week 9 Selenium Document](docs/week-9-selenium-test-design-local-execution.md) | `FactoryDashboardSeleniumTest.java` (5 CUJs), headless execution, screenshot mechanism |
| **Week 10**| **Continuous Testing in Jenkins** | [Week 10 Continuous Test Document](docs/week-10-continuous-testing-in-jenkins.md) | Jenkins test stage, test failure gating demonstration, defect correction commit & rerun |
| **Week 11**| **Docker Image & Container Lifecycle**| [Week 11 Docker Lifecycle Document](docs/week-11-docker-image-container-lifecycle.md) | Multi-stage `Dockerfile`, `docker-compose.yml`, container build/run/inspect/stop commands |
| **Week 12**| **Jenkins-Docker Continuous Deploy** | [Week 12 Jenkins-Docker CD Document](docs/week-12-jenkins-docker-continuous-deployment.md) | Versioned Docker image, registry publish log, automated container deploy & rollback |
| **Week 13**| **Configuration Management (Ansible)** | [Week 13 Ansible Document](docs/week-13-configuration-management-ansible.md) | Ansible inventory (`hosts.ini`), YAML playbook, systemd service, firewall & execution log |
| **Week 14**| **Automated Provisioning & Reliability**| [Week 14 Reliability Document](docs/week-14-automated-provisioning-reliability-validation.md) | Clean node provisioning, idempotency proof (`changed=0`), health check & rollback trace |
| **Week 15**| **Final Release, Documentation & Viva**| [Week 15 Viva & Final Report](docs/week-15-final-release-documentation-and-viva-guide.md) | End-to-end workflow trace, technical architecture, troubleshooting, roadmap & Viva Q&A |

---

## 🛠️ Technology Stack

- **Backend**: Java 17 / 21, Spring Boot 3.2, Spring Data JPA, Bean Validation
- **Database**: H2 In-Memory Database (Development) / MySQL 8.0 (Production)
- **Build System**: Apache Maven (`mvnw`)
- **Frontend**: Glassmorphism UI (HTML5, Vanilla CSS3, JavaScript Async ES6 Fetch API)
- **Reverse Proxy**: Nginx (Port 80)
- **Automated Testing**: JUnit 5, Selenium WebDriver (Headless Chrome)
- **DevOps & CI/CD**: Jenkins Declarative Pipeline (`Jenkinsfile`), Docker, Docker Compose, Docker Registry

---

## 🚀 Quick Start & Local Execution

### 1. Run Backend Application Locally
```bash
cd backend
./mvnw spring-boot:run
```
Access the web dashboard in browser at: `http://localhost:8085/` or H2 Console at `http://localhost:8085/h2-console`.

### 2. Execute Automated Unit & Integration Tests
```bash
cd backend
./mvnw test
```

### 3. Run Selenium End-to-End Test Suite
```bash
cd backend
./mvnw test -Dtest=FactoryDashboardSeleniumTest
```

### 4. Build and Launch Versioned Docker Container
```bash
docker build -t factory-energy-dashboard:1.0.0 .
docker run -d --name factory-app-instance -p 8085:8085 factory-energy-dashboard:1.0.0
```
Access in browser at: `http://localhost:8085`

---

## 📡 REST API Quick Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/dashboard/summary` | Get aggregated KPI cards metrics |
| `GET` | `/api/v1/energy/logs` | Fetch telemetry records (supports `?search=` filter) |
| `POST` | `/api/v1/energy/logs` | Ingest new machine telemetry payload |
| `GET` | `/api/v1/dashboard/drilldown/{machineId}` | Fetch machine-specific historical telemetry drill-down |
| `GET` | `/api/v1/alerts` | List active & historical system anomaly alerts |
| `PUT` | `/api/v1/alerts/{id}/acknowledge` | Acknowledge active alert exception |

---
*Factory Energy Consumption Dashboard Project Release Baseline v2.0.0-final*
