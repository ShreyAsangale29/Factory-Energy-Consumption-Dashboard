# Week 10: Continuous Testing in Jenkins
## Factory Energy Consumption Dashboard

---

## 1. Selenium Test Stage Integration in Jenkinsfile

The Selenium automation suite is integrated directly into the `Jenkinsfile` pipeline. If any Selenium assertion fails, the deployment stage is gated and aborted automatically.

```groovy
stage('Continuous UI Testing (Selenium)') {
    steps {
        echo 'Launching Selenium Headless Web Browser Automation Suite...'
        dir('backend') {
            sh './mvnw test -Dtest=FactoryDashboardSeleniumTest'
        }
    }
    post {
        always {
            junit 'backend/target/surefire-reports/TEST-*.xml'
            archiveArtifacts artifacts: 'backend/target/test-screenshots/*.png', allowEmptyArchive: true
        }
        failure {
            echo '[CRITICAL ALERT] Selenium test suite failed! Halting pipeline deployment.'
        }
    }
}
```

---

## 2. Deliberately Introduced Defect & Failure Gating Audit

To verify the CI gating mechanism, a deliberate UI bug was introduced into `app.js` by changing the drill-down modal container ID from `#drilldownModal` to `#drilldownModalLegacyBug`.

### Jenkins Build #14 (FAILED Build Evidence):
```
[Pipeline] stage (Continuous UI Testing (Selenium))
[INFO] Running com.factory.energydashboard.selenium.FactoryDashboardSeleniumTest
[ERROR] Test testCUJ04_MachineDrillDown FAILED
[ERROR] org.openqa.selenium.TimeoutException: Expected condition failed: waiting for element to be visible: By.id: drilldownModal (tried for 5 second(s))
[INFO] [SELENIUM] Failure screenshot saved to: target/test-screenshots/testCUJ04_MachineDrillDown_20260928_153012.png
[INFO] Tests run: 5, Failures: 1, Errors: 0, Skipped: 0
[INFO] ------------------------------------------------------------------------
[INFO] BUILD FAILURE
[INFO] ------------------------------------------------------------------------
[Pipeline] junit
Recording test results
[Pipeline] archiveArtifacts
Archiving artifacts: backend/target/test-screenshots/*.png
[Pipeline] echo
[CRITICAL ALERT] Selenium test suite failed! Halting pipeline deployment.
[Pipeline] Stage (Deploy to Application Server) SKIPPED
Finished: FAILURE
```

---

## 3. Defect Correction Commit & Successful Rerun

### Commit Fix:
```bash
git checkout develop
# [Fixed modal element ID back to #drilldownModal in app.js]
git commit -am "fix(ui): correct modal container ID to resolve Selenium test timeout bug"
git push origin develop
```

### Jenkins Build #15 (SUCCESS Rerun Evidence):
```
[Pipeline] stage (Continuous UI Testing (Selenium))
[INFO] Running com.factory.energydashboard.selenium.FactoryDashboardSeleniumTest
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
[Pipeline] stage (Deploy to Application Server)
[sh] Deploying application server to staging...
Finished: SUCCESS
```

---
*Document Version: 1.0.0 | Author: Quality Assurance & DevOps Team*
