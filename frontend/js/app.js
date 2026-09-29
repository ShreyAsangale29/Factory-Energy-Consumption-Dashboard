/**
 * Factory Energy Consumption Dashboard Frontend Application
 * Interacts with Spring Boot REST Endpoints & Handles UI Interactions
 */

const API_BASE = '/api/v1';

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    loadDashboardSummary();
    loadTelemetryLogs();
    loadAlerts();

    setupEventListeners();
});

// Real-Time Clock
function initClock() {
    const clock = document.getElementById('clockDisplay');
    setInterval(() => {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString();
    }, 1000);
}

// Event Listeners Setup
function setupEventListeners() {
    // Refresh Button
    document.getElementById('refreshBtn').addEventListener('click', () => {
        loadDashboardSummary();
        loadTelemetryLogs();
        loadAlerts();
    });

    // Search and Filters
    document.getElementById('searchInput').addEventListener('input', filterLogs);
    document.getElementById('lineFilter').addEventListener('change', filterLogs);
    document.getElementById('statusFilter').addEventListener('change', filterLogs);

    // Ingestion Form Modal
    const entryModal = document.getElementById('entryModal');
    document.getElementById('openEntryModalBtn').addEventListener('click', () => entryModal.classList.remove('hidden'));
    document.getElementById('closeEntryModalBtn').addEventListener('click', () => entryModal.classList.add('hidden'));
    document.getElementById('cancelEntryModalBtn').addEventListener('click', () => entryModal.classList.add('hidden'));
    document.getElementById('telemetryForm').addEventListener('submit', handleTelemetrySubmit);

    // Drill-down Modal
    const drilldownModal = document.getElementById('drilldownModal');
    document.getElementById('closeDrilldownModalBtn').addEventListener('click', () => drilldownModal.classList.add('hidden'));

    // Alerts Drawer
    const alertDrawer = document.getElementById('alertDrawer');
    document.getElementById('toggleAlertDrawerBtn').addEventListener('click', () => alertDrawer.classList.remove('hidden'));
    document.getElementById('closeAlertDrawerBtn').addEventListener('click', () => alertDrawer.classList.add('hidden'));

    // Top Alert Banner Dismiss
    document.getElementById('dismissBannerBtn').addEventListener('click', () => {
        document.getElementById('topAlertBanner').classList.add('hidden');
    });
}

// Fetch & Update Summary KPI Cards
async function loadDashboardSummary() {
    try {
        const res = await fetch(`${API_BASE}/dashboard/summary`);
        if (!res.ok) return;
        const data = await res.json();

        document.getElementById('kpiTotalKwh').innerHTML = `${data.totalConsumptionKWh} <span class="kpi-unit">kWh</span>`;
        document.getElementById('kpiPeakKw').innerHTML = `${data.peakPowerKW} <span class="kpi-unit">kW</span>`;
        document.getElementById('kpiActiveAlerts').textContent = data.activeAlertsCount;
        document.getElementById('navAlertBadge').textContent = data.activeAlertsCount;
        document.getElementById('kpiPowerFactor').textContent = data.averagePowerFactor.toFixed(2);
        document.getElementById('kpiEfficiencyScore').innerHTML = `${data.efficiencyScorePercent}<span class="kpi-unit">%</span>`;
    } catch (err) {
        console.error('Failed to load dashboard summary:', err);
    }
}

// Fetch & Render Telemetry Logs Table
let globalLogs = [];

async function loadTelemetryLogs() {
    try {
        const res = await fetch(`${API_BASE}/energy/logs`);
        if (!res.ok) return;
        globalLogs = await res.json();
        renderTable(globalLogs);
    } catch (err) {
        console.error('Failed to load telemetry logs:', err);
    }
}

function renderTable(logs) {
    const tbody = document.getElementById('telemetryTableBody');
    tbody.innerHTML = '';

    if (logs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding: 2rem;">No telemetry records found.</td></tr>`;
        return;
    }

    logs.forEach(log => {
        const tr = document.createElement('tr');
        
        let statusBadge = `<span class="badge badge-success">NORMAL</span>`;
        if (log.status === 'WARNING') statusBadge = `<span class="badge badge-warning">WARNING</span>`;
        if (log.status === 'CRITICAL') statusBadge = `<span class="badge badge-danger">CRITICAL</span>`;

        const formattedDate = new Date(log.recordedAt).toLocaleString();

        tr.innerHTML = `
            <td><strong>${log.machineId}</strong></td>
            <td>${log.machineName}</td>
            <td>${log.productionLine}</td>
            <td><strong>${log.powerConsumptionKW} kW</strong></td>
            <td>${log.voltageV} V</td>
            <td>${log.currentA} A</td>
            <td>${log.powerFactor}</td>
            <td>${statusBadge}</td>
            <td>${formattedDate}</td>
            <td>
                <button class="btn btn-secondary inspect-btn" onclick="openDrilldown('${log.machineId}')">Inspect</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filterLogs() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const line = document.getElementById('lineFilter').value;
    const status = document.getElementById('statusFilter').value;

    const filtered = globalLogs.filter(log => {
        const matchesQuery = log.machineId.toLowerCase().includes(query) ||
                             log.machineName.toLowerCase().includes(query) ||
                             log.productionLine.toLowerCase().includes(query);
        
        const matchesLine = (line === 'ALL') || log.productionLine.toLowerCase().includes(line.toLowerCase());
        const matchesStatus = (status === 'ALL') || log.status.toUpperCase() === status.toUpperCase();

        return matchesQuery && matchesLine && matchesStatus;
    });

    renderTable(filtered);
}

// Ingest Telemetry Submit Handler
async function handleTelemetrySubmit(e) {
    e.preventDefault();

    const payload = {
        machineId: document.getElementById('formMachineId').value,
        machineName: document.getElementById('formMachineName').value,
        productionLine: document.getElementById('formProductionLine').value,
        powerConsumptionKW: parseFloat(document.getElementById('formPowerKW').value),
        voltageV: parseFloat(document.getElementById('formVoltageV').value),
        currentA: parseFloat(document.getElementById('formCurrentA').value),
        powerFactor: parseFloat(document.getElementById('formPowerFactor').value),
        recordedBy: 'UI_OPERATOR'
    };

    try {
        const res = await fetch(`${API_BASE}/energy/logs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            const savedLog = await res.json();
            document.getElementById('entryModal').classList.add('hidden');
            document.getElementById('telemetryForm').reset();

            // Refresh view
            loadDashboardSummary();
            loadTelemetryLogs();
            loadAlerts();

            // Trigger top alert banner if critical
            if (savedLog.status === 'CRITICAL' || savedLog.status === 'WARNING') {
                showTopAlertBanner(`[${savedLog.status}] High Power Anomaly for ${savedLog.machineName}: ${savedLog.powerConsumptionKW} kW!`);
            }
        } else {
            alert('Error submitting telemetry payload. Please check field values.');
        }
    } catch (err) {
        console.error('Submission error:', err);
    }
}

function showTopAlertBanner(msg) {
    const banner = document.getElementById('topAlertBanner');
    document.getElementById('topAlertMessage').textContent = msg;
    banner.classList.remove('hidden');
}

// Open Machine Status Drill-Down Modal
async function openDrilldown(machineId) {
    try {
        const res = await fetch(`${API_BASE}/dashboard/drilldown/${machineId}`);
        if (!res.ok) return;
        const data = await res.json();

        document.getElementById('drilldownMachineTitle').textContent = `Telemetry Drill-Down: ${data.machineName} (${data.machineId})`;
        document.getElementById('ddCurrentPower').textContent = `${data.currentPowerKW} kW`;
        document.getElementById('ddPeakPower').textContent = `${data.peakPowerKW} kW`;
        document.getElementById('ddAvgPF').textContent = data.avgPowerFactor;
        document.getElementById('ddHealthStatus').textContent = data.healthStatus;
        document.getElementById('ddAdviceText').textContent = data.maintenanceAdvice;

        const tbody = document.getElementById('ddHistoryBody');
        tbody.innerHTML = '';
        data.telemetryHistory.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${new Date(item.recordedAt).toLocaleString()}</td>
                <td>${item.powerConsumptionKW} kW</td>
                <td>${item.voltageV} V</td>
                <td>${item.currentA} A</td>
                <td>${item.powerFactor}</td>
                <td>${item.status}</td>
            `;
            tbody.appendChild(tr);
        });

        document.getElementById('drilldownModal').classList.remove('hidden');
    } catch (err) {
        console.error('Failed to load drilldown:', err);
    }
}

// Fetch & Render System Alerts Drawer
async function loadAlerts() {
    try {
        const res = await fetch(`${API_BASE}/alerts`);
        if (!res.ok) return;
        const alerts = await res.json();

        const container = document.getElementById('alertDrawerList');
        container.innerHTML = '';

        if (alerts.length === 0) {
            container.innerHTML = `<p style="padding: 1rem; color: #8a99ad;">No active system anomaly alerts.</p>`;
            return;
        }

        alerts.forEach(alert => {
            const card = document.createElement('div');
            card.className = `alert-card glass-panel`;
            card.style.padding = '1rem';
            card.style.marginBottom = '0.75rem';
            card.style.borderLeft = alert.severity === 'CRITICAL' ? '4px solid #ef4444' : '4px solid #f59e0b';

            card.innerHTML = `
                <div style="display:flex; justify-between; align-items:center;">
                    <strong>${alert.severity} Alert: ${alert.machineId}</strong>
                    <span class="badge ${alert.status === 'OPEN' ? 'badge-danger' : 'badge-success'}">${alert.status}</span>
                </div>
                <p style="font-size: 0.85rem; margin: 0.5rem 0;">${alert.message}</p>
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; color:#8a99ad;">
                    <span>Triggered: ${new Date(alert.triggeredAt).toLocaleTimeString()}</span>
                    ${alert.status === 'OPEN' ? `<button class="btn btn-secondary ack-alert-btn" style="font-size:0.75rem;" onclick="acknowledgeAlert(${alert.id})">Acknowledge</button>` : ''}
                </div>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error('Failed to load alerts:', err);
    }
}

async function acknowledgeAlert(alertId) {
    try {
        const res = await fetch(`${API_BASE}/alerts/${alertId}/acknowledge`, { method: 'PUT' });
        if (res.ok) {
            loadDashboardSummary();
            loadAlerts();
        }
    } catch (err) {
        console.error('Failed to acknowledge alert:', err);
    }
}
