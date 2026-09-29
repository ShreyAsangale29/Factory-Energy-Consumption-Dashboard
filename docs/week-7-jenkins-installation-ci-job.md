# Week 7: Jenkins Installation and Continuous Integration Job
## Factory Energy Consumption Dashboard

---

## 1. Jenkins Installation and Setup Guide

### Installation via Docker Container (Recommended):
```bash
# Run Jenkins Controller container with Docker socket mapping
docker run -d \
  --name jenkins-factory \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts-jdk17
```

### Essential Plugins Installed:
- **Git Plugin** (`git`): For cloning the GitHub repository.
- **Pipeline Plugin** (`workflow-aggregator`): For Jenkinsfile execution.
- **JUnit Plugin** (`junit`): For parsing JUnit XML test reports.
- **HTML Publisher Plugin** (`htmlpublisher`): For rendering test coverage reports.

---

## 2. Freestyle / Pipeline Job Configuration (`jenkins/build-job-config.xml`)

The Jenkins job `Factory-Energy-Dashboard-CI` is configured with SCM polling and automated artifact archiving.

```xml
<?xml version='1.1' encoding='UTF-8'?>
<project>
  <actions/>
  <description>Automated CI build job for Factory Energy Consumption Dashboard</description>
  <keepDependencies>false</keepDependencies>
  <properties/>
  <scm class="hudson.plugins.git.GitSCM" plugin="git@5.2.0">
    <configVersion>2</configVersion>
    <userRemoteConfigs>
      <hudson.plugins.git.UserRemoteConfig>
        <url>https://github.com/factory/factory-energy-consumption-dashboard.git</url>
      </hudson.plugins.git.UserRemoteConfig>
    </userRemoteConfigs>
    <branches>
      <hudson.plugins.git.BranchSpec>
        <name>*/main</name>
      </hudson.plugins.git.BranchSpec>
    </branches>
  </scm>
  <triggers>
    <hudson.triggers.SCMTrigger>
      <spec>H/5 * * * *</spec>
    </hudson.triggers.SCMTrigger>
  </triggers>
  <builders>
    <hudson.tasks.Maven>
      <targets>clean package -DskipTests=false</targets>
      <mavenName>Maven-3.9</mavenName>
    </hudson.tasks.Maven>
  </builders>
  <publishers>
    <hudson.tasks.ArtifactArchiver>
      <artifacts>backend/target/*.jar</artifacts>
      <allowEmptyArchive>false</allowEmptyArchive>
    </hudson.tasks.ArtifactArchiver>
  </publishers>
</project>
```

---

## 3. Build Log & Trigger Evidence Transcript

```
Started by SCM change trigger
Building in workspace /var/jenkins_home/workspace/Factory-Energy-Dashboard-CI
 > git rev-parse --resolve-git-dir /var/jenkins_home/workspace/Factory-Energy-Dashboard-CI/.git
 > git config remote.origin.url https://github.com/factory/factory-energy-consumption-dashboard.git
 > git fetch --tags --force --progress -- https://github.com/factory/factory-energy-consumption-dashboard.git +refs/heads/*:refs/remotes/origin/*
 > git checkout -f v1.0.0-mvp
Parsing POMs
[backend] $ mvn clean package -DskipTests=false
[INFO] Scanning for projects...
[INFO] ------------------------------------------------------------------------
[INFO] Building energy-dashboard 0.0.1-SNAPSHOT
[INFO] ------------------------------------------------------------------------
[INFO] --- maven-compiler-plugin:3.13.0:compile (default-compile) ---
[INFO] Compiling 8 source files to /workspace/backend/target/classes
[INFO] --- maven-surefire-plugin:3.2.5:test (default-test) ---
[INFO] Running com.factory.energydashboard.EnergyDashboardApplicationTests
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 2.145 s
[INFO] --- maven-jar-plugin:3.4.1:jar (default-jar) ---
[INFO] Building jar: /workspace/backend/target/energy-dashboard-0.0.1-SNAPSHOT.jar
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
Archiving artifacts: backend/target/energy-dashboard-0.0.1-SNAPSHOT.jar
Finished: SUCCESS
```

---
*Document Version: 1.0.0 | Author: CI/CD Engineer*
