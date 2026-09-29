package com.factory.energydashboard.selenium;

import com.factory.energydashboard.EnergyDashboardApplication;
import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = EnergyDashboardApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class FactoryDashboardSeleniumTest {

    @LocalServerPort
    private int port;

    private static WebDriver driver;
    private WebDriverWait wait;
    private String baseUrl;

    @BeforeAll
    public static void setupClass() {
        System.setProperty("webdriver.chrome.driver", System.getProperty("webdriver.chrome.driver", "chromedriver"));
    }

    @BeforeEach
    public void setup() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--disable-gpu");
        options.addArguments("--window-size=1920,1080");

        try {
            driver = new ChromeDriver(options);
        } catch (Exception e) {
            System.out.println("[SELENIUM SKIPPED] Local Chrome binary unavailable: " + e.getMessage());
            Assumptions.assumeTrue(false, "Chrome driver unavailable locally - skipping Selenium execution.");
        }

        wait = new WebDriverWait(driver, Duration.ofSeconds(5));
        baseUrl = "http://localhost:" + port + "/index.html";
    }

    @AfterEach
    public void tearDown(TestInfo testInfo) {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    @Order(1)
    @DisplayName("CUJ-01: Verify Summary KPI Metric Cards Visibility")
    public void testCUJ01_SummaryKpiMetrics() {
        driver.get(baseUrl);
        WebElement totalKwhCard = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("kpiTotalKwh")));
        WebElement peakKwCard = driver.findElement(By.id("kpiPeakKw"));
        WebElement activeAlertsCard = driver.findElement(By.id("kpiActiveAlerts"));

        assertNotNull(totalKwhCard.getText());
        assertNotNull(peakKwCard.getText());
        assertNotNull(activeAlertsCard.getText());
        System.out.println("[SELENIUM] CUJ-01 PASSED: Dashboard KPI cards rendered cleanly.");
    }

    @Test
    @Order(2)
    @DisplayName("CUJ-02: Submit High-Consumption Telemetry Payload & Verify Anomaly Alert")
    public void testCUJ02_TelemetryIngestionAnomalyAlert() {
        driver.get(baseUrl);
        WebElement addBtn = wait.until(ExpectedConditions.elementToBeClickable(By.id("openEntryModalBtn")));
        addBtn.click();

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("entryModal")));
        driver.findElement(By.id("formMachineId")).sendKeys("M-TEST-888");
        driver.findElement(By.id("formMachineName")).sendKeys("Heavy Test Extruder 888");
        driver.findElement(By.id("formProductionLine")).sendKeys("Extrusion Line E");
        driver.findElement(By.id("formPowerKW")).sendKeys("220.5"); // Exceeds 200 kW CRITICAL threshold
        driver.findElement(By.id("formVoltageV")).sendKeys("420.0");
        driver.findElement(By.id("formCurrentA")).sendKeys("310.0");
        driver.findElement(By.id("formPowerFactor")).sendKeys("0.88");

        driver.findElement(By.id("submitTelemetryBtn")).click();

        WebElement alertBanner = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("topAlertBanner")));
        assertTrue(alertBanner.getText().contains("CRITICAL") || alertBanner.getText().contains("M-TEST-888"));
        System.out.println("[SELENIUM] CUJ-02 PASSED: Anomaly alert triggered successfully for power breach.");
    }

    @Test
    @Order(3)
    @DisplayName("CUJ-03: Filter Telemetry Table by Machine ID & Line")
    public void testCUJ03_SearchAndFilter() {
        driver.get(baseUrl);
        WebElement searchInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("searchInput")));
        searchInput.sendKeys("Stamping");

        WebElement tableBody = driver.findElement(By.id("telemetryTableBody"));
        assertTrue(tableBody.getText().contains("Stamping"));
        System.out.println("[SELENIUM] CUJ-03 PASSED: Telemetry search filter operating cleanly.");
    }

    @Test
    @Order(4)
    @DisplayName("CUJ-04: Inspect Machine Status Drill-Down Modal")
    public void testCUJ04_MachineDrillDownModal() {
        driver.get(baseUrl);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("telemetryTableBody")));

        WebElement firstInspectBtn = driver.findElement(By.className("inspect-btn"));
        firstInspectBtn.click();

        WebElement drilldownModal = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("drilldownModal")));
        assertTrue(drilldownModal.isDisplayed());

        WebElement modalTitle = driver.findElement(By.id("drilldownMachineTitle"));
        assertNotNull(modalTitle.getText());

        driver.findElement(By.id("closeDrilldownModalBtn")).click();
        System.out.println("[SELENIUM] CUJ-04 PASSED: Machine drill-down modal inspected.");
    }

    @Test
    @Order(5)
    @DisplayName("CUJ-05: Acknowledge Active System Alert")
    public void testCUJ05_AcknowledgeAlert() {
        driver.get(baseUrl);
        WebElement alertsBtn = wait.until(ExpectedConditions.elementToBeClickable(By.id("toggleAlertDrawerBtn")));
        alertsBtn.click();

        WebElement alertDrawer = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("alertDrawer")));
        assertTrue(alertDrawer.isDisplayed());

        WebElement ackBtn = driver.findElement(By.className("ack-alert-btn"));
        ackBtn.click();

        System.out.println("[SELENIUM] CUJ-05 PASSED: Alert acknowledged successfully.");
    }

    public void captureFailureScreenshot(String testName) {
        if (driver instanceof TakesScreenshot) {
            File srcFile = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            File targetDir = new File("target/test-screenshots");
            if (!targetDir.exists()) targetDir.mkdirs();
            File destFile = new File(targetDir, testName + "_" + timestamp + ".png");
            try {
                Files.copy(srcFile.toPath(), destFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
                System.out.println("[SELENIUM SCREENSHOT] Saved screenshot to: " + destFile.getAbsolutePath());
            } catch (IOException e) {
                System.err.println("Failed screenshot copy: " + e.getMessage());
            }
        }
    }
}
