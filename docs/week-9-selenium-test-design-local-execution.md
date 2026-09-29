# Week 9: Selenium Test Design and Local Execution
## Factory Energy Consumption Dashboard

---

## 1. Automated Test Plan & Critical User Journeys

The end-to-end automation suite uses **Selenium WebDriver (Java + JUnit 5)** using Page Object Model (POM) design to validate core web dashboard flows.

### Critical User Journeys (CUJ):

1. **CUJ-01 Dashboard KPI Metrics Visibility**:
   - Navigate to `http://localhost:8080/index.html`.
   - Assert KPI cards exist: Total Consumption (kWh), Peak Power (kW), Active Alerts, Power Factor, Efficiency Score.
   - Assert metric values are greater than zero.

2. **CUJ-02 Real-Time Telemetry Ingestion & Anomaly Alert Trigger**:
   - Open "Add Telemetry Reading" modal dialog.
   - Enter Machine ID `M-PRESS-900`, Power `215.5 kW` (exceeding CRITICAL 200 kW threshold), Voltage `415 V`.
   - Submit form and verify table row insertion.
   - Assert red `CRITICAL` alert banner appears automatically with message `High Power Consumption Breach`.

3. **CUJ-03 Telemetry Search & Filter**:
   - Type `Stamping` into search input bar.
   - Assert table filters rows to display only Stamping Line records.
   - Assert result count updates dynamically.

4. **CUJ-04 Machine Status Inspection Drill-Down**:
   - Click "Inspect" button on row `M-PRESS-101`.
   - Assert drill-down modal opens displaying telemetry history chart, max voltage, peak load, and status.
   - Close modal dialog via close button.

5. **CUJ-05 Alert Acknowledgement Flow**:
   - Open Active Alerts drawer view.
   - Locate active alert for `M-PRESS-900`.
   - Click "Acknowledge Alert" button.
   - Assert alert badge status updates from `OPEN` to `ACKNOWLEDGED`.

---

## 2. Screenshot Capture Mechanism on Failure

```java
public void captureFailureScreenshot(WebDriver driver, String testName) {
    File srcFile = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
    String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
    File destFile = new File("target/test-screenshots/" + testName + "_" + timestamp + ".png");
    try {
        FileUtils.copyFile(srcFile, destFile);
        System.out.println("[SELENIUM] Failure screenshot saved to: " + destFile.getAbsolutePath());
    } catch (IOException e) {
        System.err.println("Failed to save screenshot: " + e.getMessage());
    }
}
```

---

## 3. Local Maven Execution Command & Test Report

```bash
# Command to execute Selenium automation suite locally
mvn test -Dtest=FactoryDashboardSeleniumTest
```

### Execution Log Summary:
```
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.factory.energydashboard.selenium.FactoryDashboardSeleniumTest
[INFO] [SELENIUM] Initializing Headless Chrome WebDriver...
[INFO] [SELENIUM] Executing CUJ-01: Verifying Summary KPI Metrics... PASSED
[INFO] [SELENIUM] Executing CUJ-02: Submitting Anomaly Telemetry Payload... PASSED
[INFO] [SELENIUM] Executing CUJ-03: Filtering Telemetry Table by Machine & Line... PASSED
[INFO] [SELENIUM] Executing CUJ-04: Opening Machine Drill-Down Modal... PASSED
[INFO] [SELENIUM] Executing CUJ-05: Acknowledging Active System Alert... PASSED
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 8.412 s
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```

---
*Document Version: 1.0.0 | Author: Quality Assurance & Test Automation Team*
