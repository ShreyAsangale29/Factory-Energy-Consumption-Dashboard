# Factory Energy Consumption Dashboard
## Detailed Project Presentation Script and Slide Deck Handbook

> **A Comprehensive Slide-by-Slide Presenter Script, Visual Cues, Technical Narrative, and Viva Defense Guide (Weeks 1 to 15)**

---

## 📽️ Presentation Structure Overview
- **Total Slides**: 15 Slides
- **Estimated Duration**: 15–20 Minutes
- **Target Audience**: Technical Evaluators, Project Steering Committee, Plant Managers, and DevOps Engineering Panel.

---

## Slide 1: Title & Project Overview

### 🖼️ Visual Content on Slide:
- **Title**: Factory Energy Consumption Dashboard
- **Subtitle**: Real-Time Industrial IoT Telemetry Ingestion, Automated Anomaly Exception Engine, Jenkins-Docker CI/CD & Ansible Provisioning
- **Presenter Name**: Lead Software & DevOps Engineering Team
- **Project Version**: `v2.0.0-final`
- **Tech Icons**: Java 17 | Spring Boot | Glassmorphism UI | Selenium | Jenkins | Docker | Ansible

### 🎤 Presenter Spoken Script:
> *"Good morning, esteemed panel members and evaluators. Today, we are proud to present our project: the **Factory Energy Consumption Dashboard**.*
> 
> *In modern heavy manufacturing facilities, electrical energy is one of the highest operational expenses. Yet, traditional plants operate with zero real-time visibility into machine-level power draw—relying instead on monthly utility bills received long after energy waste has occurred.*
> 
> *Over a 15-week Agile and DevOps engineering timeline, our team designed, built, tested, containerized, and provisioned a full-stack real-time telemetry monitoring platform that bridges industrial operational technology with modern software automation. Today, we will take you through our problem definition, architecture, live application demo, automated testing suite, Jenkins pipeline, Docker containerization, Ansible provisioning, and reliability validation."*

---

## Slide 2: Problem Statement & Industrial Pain Points

### 🖼️ Visual Content on Slide:
- **Problem Statement Callout**: *"Factory plant managers lack real-time visibility into machine-level power consumption, resulting in undetected energy waste, peak power penalty charges, and unexpected equipment breakdowns."*
- **3 Core Pain Points Graphic**:
  1. ⏳ **Data Latency**: Energy waste discovered weeks after consumption.
  2. ⚡ **Peak Demand Tariffs**: Unplanned power surges incurring heavy utility penalty fees.
  3. 🔧 **Unplanned Downtime**: Malfunctioning motors consuming excessive idle power prior to mechanical failure.

### 🎤 Presenter Spoken Script:
> *"Let's look at the core problem. In heavy manufacturing, machines like hydraulic stamping presses, 6-axis robotic welders, and induction furnaces consume hundreds of kilowatt-hours daily. When a motor bearing begins to fail or alignment shifts, its power consumption spikes dramatically long before it physically breaks down.*
> 
> *Without machine-level real-time telemetry, plant managers are blind to these power surges until utility bills arrive or machinery breaks on the factory line. Our system solves this by delivering real-time telemetry ingestion, instant anomaly evaluation, and machine-level status drill-downs to reduce Mean Time to Detect energy anomalies from weeks down to under 30 seconds."*

---

## Slide 3: Stakeholders & Measurable Success Criteria

### 🖼️ Visual Content on Slide:
- **Stakeholder Matrix Table**:
  - *Plant Manager*: Total kWh cost tracking & ESG compliance.
  - *Energy Auditor*: Power factor analysis & efficiency rating.
  - *Maintenance Tech*: Real-time anomaly alerts & diagnostic advice.
  - *DevOps Admin*: Platform stability, zero-downtime deployment, container isolation.
- **Key Performance Indicators (KPI Targets)**:
  - 📉 15% reduction in off-shift idle power waste.
  - ⚡ 0 peak demand utility penalty charges.
  - ⏱️ < 30 seconds MTTD (Mean Time to Detect) energy breaches.
  - 🟢 99.9% application uptime target.

### 🎤 Presenter Spoken Script:
> *"To ensure our solution delivered tangible enterprise value, we identified five core stakeholder personas and established quantifiable success criteria.*
> 
> *For the Plant Manager, we target a 15% reduction in off-shift idle power waste. For the Energy Auditor, we track real-time Power Factor to maintain an average above 0.90 PF. For the Maintenance Technician, we enforce an anomaly detection threshold that alerts within 30 seconds of a power breach (> 160 kW Warning, > 200 kW Critical). And for our DevOps team, we enforce 99.9% platform availability using automated Jenkins container deployment and Ansible disaster recovery."*

---

## Slide 4: Multi-Tier Architecture & Technology Stack

### 🖼️ Visual Content on Slide:
- **Architecture Diagram**:
  - *Client Layer*: Responsive Glassmorphism Web UI (HTML5, Vanilla CSS3, JS Async Fetch).
  - *Proxy / Security Layer*: Nginx Reverse Proxy (Port 80 -> Upstream Port 8085).
  - *Application Layer*: Java 17 Spring Boot (WebMVC, Data JPA, Bean Validation).
  - *Database Layer*: H2 In-Memory DB (Dev) / MySQL 8.0 (Prod).
  - *DevOps Layer*: Jenkins Pipeline, Docker Container Engine, Ansible Configuration Management.

### 🎤 Presenter Spoken Script:
> *"Slide 4 illustrates our multi-tier system architecture.*
> 
> *At the presentation layer, we built a responsive dark-mode Glassmorphism dashboard using vanilla HTML5, CSS3, and JavaScript Async Fetch API—ensuring fast, zero-dependency rendering.*
> 
> *Requests flow through an Nginx reverse proxy to our Spring Boot Java 17 application tier. The backend features a clean layered architecture: REST Controllers expose clean OpenAPI endpoints, the Service layer houses our real-time anomaly calculation engine, and Spring Data JPA interfaces persist telemetry records to H2 and MySQL relational databases.*
> 
> *Infrastructure provisioning and CI/CD pipelines are managed via Jenkins, Docker, and Ansible."*

---

## Slide 5: Data Model & Telemetry Ingestion REST API

### 🖼️ Visual Content on Slide:
- **Entity Relationship Schema**:
  - `ENERGY_LOGS`: `id`, `machine_id`, `machine_name`, `production_line`, `power_consumption_kw`, `voltage_v`, `current_a`, `power_factor`, `status`, `recorded_at`.
  - `ALERTS`: `id`, `machine_id`, `severity` (`CRITICAL`, `WARNING`), `threshold_value`, `actual_value`, `message`, `status` (`OPEN`, `ACKNOWLEDGED`).
- **REST Endpoints Table**:
  - `POST /api/v1/energy/logs` — Ingest telemetry payload.
  - `GET /api/v1/dashboard/summary` — Aggregate KPI metrics.
  - `GET /api/v1/dashboard/drilldown/{machineId}` — Machine telemetry history.
  - `PUT /api/v1/alerts/{id}/acknowledge` — Acknowledge active alert.

### 🎤 Presenter Spoken Script:
> *"Behind the dashboard lies a normalized relational schema built around two core entities: `EnergyLog` and `Alert`.*
> 
> *When IoT sensor gateways or technicians post a telemetry payload to `/api/v1/energy/logs`, our `EnergyService` automatically validates field ranges using Bean Validation annotations (`@Positive`, `@DecimalMin(0.0)`, `@DecimalMax(1.0)`).*
> 
> *It then evaluates the power draw: if consumption exceeds 160 kW, status is flagged as WARNING; if it breaches 200 kW, it is flagged as CRITICAL, and an `Alert` record is generated instantly with timestamp and severity details."*

---

## Slide 6: Live Web Dashboard & Feature Demonstration

### 🖼️ Visual Content on Slide:
- **Dashboard Screenshots / Live Demo Highlights**:
  - 1️⃣ **Summary Indicator Cards**: Total kWh, Peak kW, Active Alerts, Power Factor, Efficiency Score (%).
  - 2️⃣ **Search & Filter Control Bar**: Instant client-side filtering by Machine ID, Name, Line, and Status.
  - 3️⃣ **Interactive Telemetry Form Modal**: Real-time telemetry ingestion.
  - 4️⃣ **Machine Status Drill-Down Inspection**: Telemetry trend charts and diagnostic advice.
  - 5️⃣ **Alert Management Drawer & Top Anomaly Banner**: Severity color coding and one-click alert acknowledgement.

### 🎤 Presenter Spoken Script:
> *"Now let's examine the live user experience.*
> 
> *As you see on the dashboard, the top row provides five instant Key Performance Indicators. Below the KPI cards is our searchable telemetry table. As operators type machine names or select production lines like 'Stamping Line A', the table dynamically filters matching records in under 300 milliseconds.*
> 
> *When clicking 'Inspect' on any machine row, a detailed diagnostic modal appears, displaying historical telemetry trends, peak load spikes, and automated maintenance recommendations.*
> 
> *Furthermore, whenever a machine breaches energy safety thresholds, a bright red anomaly banner flashes across the top navigation bar, and the alert is pushed into the Active Alerts drawer for operator acknowledgement."*

---

## Slide 7: Agile Planning & Git Collaboration Workflow

### 🖼️ Visual Content on Slide:
- **Agile Scrum Schedule**: 15-week timeline from problem definition to final release.
- **Git Branching Diagram**:
  - Protected `main` branch tagged `v1.0.0-mvp` and `v2.0.0-final`.
  - Integration `develop` branch.
  - Parallel topic branches `feature/dashboard-ui` & `feature/alert-banner-ui`.
- **Merge Conflict Resolution Callout**: Illustrated conflict creation and resolution in `EnergyService.java` for threshold constants.

### 🎤 Presenter Spoken Script:
> *"Agile project management and disciplined Git branching were central to our development workflow.*
> 
> *We operated across a 15-week timeline structured into 4 major sprints. We enforced conventional commit guidelines (`feat:`, `fix:`, `docs:`, `chore:`) and Git Flow branching conventions.*
> 
> *In Week 6, we demonstrated Git collaboration mechanics by simulating a merge conflict between two parallel feature branches modifying `EnergyService.java`. We resolved the conflict systematically, executed regression tests, merged into `develop`, and tagged our release candidate `v1.0.0-mvp`."*

---

## Slide 8: Automated Quality Gate — Selenium WebDriver E2E Test Suite

### 🖼️ Visual Content on Slide:
- **Selenium Architecture**: Java 17 + Selenium WebDriver + JUnit 5 + `WebDriverManager`.
- **5 Critical User Journeys (CUJs)**:
  - `testCUJ01`: Summary KPI Cards Visibility.
  - `testCUJ02`: Telemetry Ingestion & Anomaly Alert Banner Trigger.
  - `testCUJ03`: Dynamic Search & Production Line Filtering.
  - `testCUJ04`: Machine Drill-Down Diagnostic Modal.
  - `testCUJ05`: Alert Drawer Opening & Acknowledgement Action.
- **Failure Screenshot Capture**: Automatic PNG screenshot generation in `target/test-screenshots/`.

### 🎤 Presenter Spoken Script:
> *"Quality assurance is enforced through our automated Selenium WebDriver test suite in Java.*
> 
> *Using the Page Object Pattern, we automated five Critical User Journeys that validate every aspect of the dashboard UI. The suite launches Headless Chrome, populates forms, submits telemetry payloads, asserts element visibility, and validates alert state transitions.*
> 
> *If any UI element fails an assertion, our test base captures an automatic PNG failure screenshot with timestamp into `target/test-screenshots/`, providing instant visual evidence for debugging."*

---

## Slide 9: Jenkins Pipeline as Code & Continuous Integration

### 🖼️ Visual Content on Slide:
- **Jenkins Pipeline Flowchart**:
  - `Checkout` -> `Compile & Package` -> `Unit & Selenium Tests` -> `Docker Build` -> `Registry Publish` -> `Deploy` -> `Health Check`.
- **SCM Trigger**: Automated polling every 5 minutes (`H/5 * * * *`) or GitHub webhook trigger.
- **Artifact Archiving**: Storing `energy-dashboard-0.0.1-SNAPSHOT.jar` in Jenkins artifact repository.

### 🎤 Presenter Spoken Script:
> *"In Weeks 7 and 8, we codified our entire Continuous Integration process into a declarative `Jenkinsfile` stored directly in version control.*
> 
> *Whenever code is committed to GitHub, Jenkins automatically triggers a build. The pipeline checks out the source code, compiles Java binaries using Maven, runs unit tests, executes our Selenium E2E suite, packages the executable JAR, and archives the build artifact in Jenkins.*
> 
> *If any stage fails, Jenkins halts the build immediately and notifies the engineering team."*

---

## Slide 10: Docker Multi-Stage Containerization

### 🖼️ Visual Content on Slide:
- **Dockerfile Comparison**:
  - *Traditional Build*: ~300 MB footprint (Maven + full JDK compiler).
  - *Multi-Stage Runtime Build*: **~47 MB footprint** (`eclipse-temurin:17-jre-alpine`).
- **Security & Port Mapping**: Non-root system user `appuser` (`UID 10001`), port mapping `-p 8085:8085`.
- **Docker Compose Stack**: Orchestration of App Container + MySQL 8.0 Database + Nginx Reverse Proxy (`docker-compose.yml`).

### 🎤 Presenter Spoken Script:
> *"For Week 11, we containerized the application using Docker.*
> 
> *We implemented a multi-stage `Dockerfile` that packages the application into an ultra-lightweight Alpine JRE runtime (`eclipse-temurin:17-jre-alpine`). This reduced our production container size from ~300 MB down to just 47 MB, accelerating deployment speed and eliminating compiler attack vectors.*
> 
> *For security compliance, the container runs under a non-root system account (`appuser`). We also created a `docker-compose.yml` file to orchestrate the dashboard alongside MySQL and an Nginx reverse proxy."*

---

## Slide 11: Jenkins-Docker Continuous Deployment & Registry Publishing

### 🖼️ Visual Content on Slide:
- **Continuous Deployment Architecture**:
  - Versioned image tagging (`factory-energy-dashboard:v1.2.0-$BUILD_NUMBER`).
  - Container Registry Push (`docker push`).
  - Automated container deployment (`docker rm -f old && docker run new`).
  - Automated HTTP Health Check (`curl http://localhost:8085/api/v1/dashboard/summary`).

### 唱 Presenter Spoken Script:
> *"In Week 12, we extended our CI pipeline into a fully automated **Commit-to-Container Continuous Deployment** workflow.*
> 
> *Upon passing all unit and Selenium quality gates, Jenkins dynamically builds a versioned Docker image tagged with the build number and git SHA. It publishes the image to Docker Registry, stops the older container on the target node, instantiates a fresh container instance on port 8085, and executes an HTTP health check ping against `/api/v1/dashboard/summary`.*
> 
> *If the health check returns HTTP 200 OK, the deployment is marked SUCCESS."*

---

## Slide 12: Infrastructure Configuration Management via Ansible

### 🖼️ Visual Content on Slide:
- **Ansible Artifacts**:
  - Inventory: `ansible/inventory/hosts.ini` (Staging & Production nodes).
  - Playbook: `ansible/playbooks/deploy-factory-dashboard.yml`.
- **5 Automated Provisioning Steps**:
  1. APT Package Installation (`openjdk-17`, `docker`, `nginx`, `ufw`).
  2. System Group & Dedicated User Creation (`energyapp`).
  3. Directory Structure Hierarchy (`/opt/factory-energy-dashboard/`).
  4. Systemd Daemon Registration (`factory-energy-dashboard.service`).
  5. UFW Firewall Enforcement (Ports `80`, `443`, `8085`).

### 🎤 Presenter Spoken Script:
> *"To ensure target servers are provisioned identically without manual configuration drift, Week 13 introduced Ansible Infrastructure-as-Code.*
> 
> *Our Ansible playbook provisions clean Ubuntu target nodes automatically. It installs Java 17 JRE and Nginx, creates a dedicated system user `energyapp`, establishes the `/opt/factory-energy-dashboard/` folder structure, deploys the Spring Boot artifact and `application.properties`, registers a systemd daemon service, configures UFW firewall rules, and starts the dashboard automatically on boot."*

---

## Slide 13: Reliability Validation, Idempotency & Disaster Recovery

### 🖼️ Visual Content on Slide:
- **Idempotency Proof Log**:
  - *Run 1*: `ok=9 changed=7 failed=0` (Initial Node Provisioning).
  - *Run 2*: `ok=9 changed=0 failed=0` (**Idempotency Verified** — zero unnecessary mutations).
- **Disaster Recovery Rollback Flow**:
  - Simulated Bad Deployment -> Health Check Fails -> Ansible Rollback Handler Triggered -> Previous Stable Baseline `v1.0.0-mvp` Restored -> `HTTP 200 OK` Health Recovered.

### 🎤 Presenter Spoken Script:
> *"In Week 14, we validated infrastructure reliability through **Idempotency** and **Disaster Recovery Rollback testing**.*
> 
> *To prove idempotency, we ran our Ansible playbook a second time on the provisioned target node. As shown in our execution recap, the second run returned `changed=0`, proving system state determinism without unwanted side effects.*
> 
> *Furthermore, we tested disaster recovery by simulating a corrupted release update. When health checks failed, Ansible automatically triggered our Rollback Handler play—restoring the previous stable artifact baseline `v1.0.0-mvp` from backup storage, restarting systemd, and recovering `HTTP 200 OK` health in seconds."*

---

## Slide 14: System Limitations & Future 2.0 Enhancement Plan

### 🖼️ Visual Content on Slide:
- **Current MVP Scope**: H2 In-memory DB default, REST JSON payload ingestion, single-tenant UI.
- **Future 2.0 Roadmap**:
  - 🤖 **AI Predictive Maintenance**: LSTM neural network power factor decay modeling for 72-hour failure forecasting.
  - 🔌 **Direct SCADA / Industrial Protocols**: Native OPC-UA and Modbus TCP smart meter hardware connectors.
  - 🌐 **3D Digital Twin Factory Floor**: WebGL 3D canvas rendering machine heatmaps across assembly lines.
  - ☁️ **Multi-Tenant Cloud SaaS**: Enterprise multi-facility tenant isolation and billing.

### 🎤 Presenter Spoken Script:
> *"While our MVP meets all core functional and DevOps requirements, we have outlined a clear roadmap for Version 2.0.*
> 
> *In future releases, we plan to integrate AI-driven predictive maintenance models trained on power factor degradation curves to forecast machine failure 72 hours before physical breakdown.*
> 
> *We also plan to add native OPC-UA and Modbus TCP industrial protocol connectors for direct PLC hardware streaming, as well as an interactive 3D WebGL Digital Twin depicting real-time factory floor heatmaps."*

---

## Slide 15: Conclusion & Viva Voce Q&A Defense

### 🖼️ Visual Content on Slide:
- **Project Summary Banner**: Complete 15-Week Roadmap Executed (Git -> Jenkins -> Selenium -> Docker -> Ansible).
- **Git Release Tag**: `v2.0.0-final`
- **Live System Links**: Dashboard `http://localhost:8085/` | H2 Console `http://localhost:8085/h2-console`
- **Q&A Title**: Thank You! Questions & Technical Evaluation.

### 🎤 Presenter Spoken Script:
> *"In conclusion, the Factory Energy Consumption Dashboard successfully demonstrates a robust, enterprise-grade DevOps workflow from Git commit to continuous testing, Docker containerization, and Ansible provisioning.*
> 
> *All 15 weekly roadmap milestones are fully completed, verified, and tagged `v2.0.0-final` in our GitHub repository.*
> 
> *Thank you for your time and attention. We are now open to your questions and technical evaluation."*

---

## 🙋 Top 10 Anticipated Viva Questions & Technical Answers

### **Q1: Why did you choose Java Spring Boot for the backend stack?**
> **Answer**: Spring Boot provides enterprise-grade performance, native JPA/Hibernate object-relational mapping, built-in Tomcat web server, strong Bean Validation (`jakarta.validation`), and seamless integration with Maven, JUnit 5, and Jenkins CI/CD pipelines.

### **Q2: Explain how your anomaly detection algorithm operates.**
> **Answer**: When telemetry is posted via REST API, `EnergyService.java` inspects `powerConsumptionKW`. If `powerConsumptionKW >= 200.0 kW`, it flags status as `CRITICAL`; if `>= 160.0 kW`, it flags `WARNING`. For any non-normal payload, it automatically generates an `Alert` entity persisted to the database with timestamp and severity.

### **Q3: How does your Selenium test suite run in headless mode inside Jenkins?**
> **Answer**: In `FactoryDashboardSeleniumTest.java`, ChromeOptions is configured with `--headless=new`, `--no-sandbox`, `--disable-dev-shm-usage`, and `--window-size=1920,1080`. `WebDriverManager` automatically resolves matching `chromedriver` binaries, allowing Chrome to execute DOM assertions invisibly inside Linux Jenkins build agents.

### **Q4: What happens when a Selenium assertion fails in the Jenkins pipeline?**
> **Answer**: If an assertion fails, JUnit registers a build failure. The `Jenkinsfile` post-failure block captures a PNG screenshot saved to `target/test-screenshots/`, publishes JUnit XML reports, and **aborts the pipeline before deployment**, ensuring broken UI code never reaches production.

### **Q5: What is the benefit of multi-stage Docker builds?**
> **Answer**: Multi-stage Docker builds allow compiling source code in a temporary builder image (JDK + Maven) and copying only the packaged executable JAR into a lightweight JRE runtime container (`eclipse-temurin:17-jre-alpine`). This reduced our image size from ~300 MB to ~47 MB and removed build tools from production for security compliance.

### **Q6: How does Docker Compose simplify multi-container management?**
> **Answer**: `docker-compose.yml` orchestrates our application container alongside MySQL 8.0 database and Nginx reverse proxy. It defines network links, volume persistence (`mysql_data`), environment variables, and restart policies (`restart: always`) in a single declarative file.

### **Q7: What is Idempotency in Ansible and why is it essential?**
> **Answer**: Idempotency ensures that running an Ansible playbook multiple times on a target server results in the exact same system state without redundant changes. In Week 14, our second run returned `changed=0`, proving that packages, folders, systemd services, and firewall rules remained in their desired state without side effects.

### **Q8: How does your automated rollback mechanism function during a failed deployment?**
> **Answer**: In both Jenkins and Ansible, deployment is followed by an HTTP URI health check against `/api/v1/dashboard/summary`. If the check fails to return `HTTP 200 OK`, the pipeline/playbook triggers a rollback handler that stops the failed process, restores the previous stable JAR baseline (`v1.0.0-mvp`) from backup storage, and restarts the service daemon.

### **Q9: How do you handle database migrations between development and production?**
> **Answer**: In development, Spring Data JPA uses `spring.jpa.hibernate.ddl-auto=update` with H2 in-memory DB populated by `DataInitializer.java`. In production, MySQL 8.0 is configured via `application-prod.properties` or environment variables (`DB_HOST`, `DB_USER`, `DB_PASS`).

### **Q10: What security measures are implemented in your Docker container setup?**
> **Answer**: The runtime container creates and executes under a dedicated non-root system account `appuser` (`UID 10001` / `GID 10001`), preventing container breakout root privileges on the Linux host. Additionally, input DTOs enforce strict validation rules.

---
*Factory Energy Consumption Dashboard Presentation Handbook — Version 2.0.0-final*
