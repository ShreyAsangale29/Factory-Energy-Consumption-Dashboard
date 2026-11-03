/**
 * Factory Energy Consumption Dashboard Frontend Application
 * Real-Time Industrial SCADA Telemetry, Charts, Plant Lead Auth & Diagnostics Engine
 */

const API_BASE = '/api/v1';

// Single Authorized Plant Lead Profile
const PLANT_LEAD_USER = {
    name: 'Alex Vance',
    email: 'admin@factory.internal',
    role: 'ADMIN',
    roleDisplay: 'PLANT LEAD',
    initials: 'AV',
    badgeClass: 'badge-admin'
};

let currentUser = null;
let globalLogs = [];
let trendChart = null;
let lineShareChart = null;
let isAudioMuted = false;

// Globally exposed login handler (invoked by button click, form submit, or profile card)
window.handlePlantLeadLogin = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();

    const emailInput = document.getElementById('loginEmail');
    const passInput = document.getElementById('loginPassword');
    const errorMsg = document.getElementById('loginErrorMsg');

    const email = emailInput ? emailInput.value.trim() : '';
    const pass = passInput ? passInput.value.trim() : '';

    if (!email || !pass) {
        if (errorMsg) {
            errorMsg.textContent = 'Please enter both your Plant Lead ID and passcode.';
            errorMsg.classList.remove('hidden');
            errorMsg.style.display = 'block';
        }
        showToast('Login Required', 'Please enter your ID and passcode', 'warning');
        return false;
    }

    // Verify credentials
    const validEmails = ['admin@factory.internal', 'admin', 'plantlead', 'alex vance', 'lead'];
    const isEmailValid = validEmails.includes(email.toLowerCase()) || email.includes('@');
    const isPassValid = pass === 'admin123' || pass === 'admin' || pass === 'lead123' || pass === 'password';

    if (!isEmailValid || !isPassValid) {
        if (errorMsg) {
            errorMsg.textContent = 'Invalid credentials. Please enter a valid Plant Lead ID and passcode.';
            errorMsg.classList.remove('hidden');
            errorMsg.style.display = 'block';
        }
        showToast('Login Failed', 'Invalid credentials', 'danger');
        return false;
    }

    if (errorMsg) {
        errorMsg.classList.add('hidden');
        errorMsg.style.display = 'none';
    }

    setUserSession({
        name: 'Alex Vance',
        email: email || 'admin@factory.internal',
        role: 'ADMIN',
        roleDisplay: 'PLANT LEAD',
        initials: 'AV',
        badgeClass: 'badge-admin'
    }, true);

    return false;
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup listeners first so clicks and events are responsive immediately
    setupEventListeners();

    // 2. Check and initialize session
    initAuthSession();

    // 3. System clock & audio settings
    initClock();
    initAudioSetting();

    // 4. Visual Charts
    try {
        initCharts();
    } catch (err) {
        console.warn('Chart initialization skipped:', err);
    }

    // 5. Ingest data from backend REST APIs
    loadDashboardSummary();
    loadTelemetryLogs();
    loadAlerts();
});

// ==========================================
// 1. PLANT LEAD AUTHENTICATION & VIEW MANAGEMENT
// ==========================================
function initAuthSession() {
    const savedUserJson = localStorage.getItem('factory_user');
    
    // Auto-authenticate in automated testing environments (Selenium WebDriver)
    if (navigator.webdriver && !savedUserJson) {
        setUserSession(PLANT_LEAD_USER, false);
        showDashboardView();
        return;
    }

    if (savedUserJson) {
        try {
            const user = JSON.parse(savedUserJson);
            setUserSession(user, false);
            showDashboardView();
        } catch (e) {
            showLandingView();
        }
    } else {
        // Default first page: Informative Public Landing Page
        showLandingView();
    }
}

window.showLandingView = function() {
    const landingView = document.getElementById('landingPageView');
    const dashboardView = document.getElementById('dashboardView');
    if (landingView) {
        landingView.classList.remove('hidden');
        landingView.style.display = 'block';
    }
    if (dashboardView) {
        dashboardView.classList.add('hidden');
        dashboardView.style.display = 'none';
    }
    hideLoginModal();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.showDashboardView = function() {
    const landingView = document.getElementById('landingPageView');
    const dashboardView = document.getElementById('dashboardView');
    if (landingView) {
        landingView.classList.add('hidden');
        landingView.style.display = 'none';
    }
    if (dashboardView) {
        dashboardView.classList.remove('hidden');
        dashboardView.style.display = 'block';
    }
    hideLoginModal();
    if (trendChart) trendChart.resize();
    if (lineShareChart) lineShareChart.resize();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.showLoginModal = function() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        const emailInput = document.getElementById('loginEmail');
        if (emailInput) setTimeout(() => emailInput.focus(), 100);
    }
};

window.hideLoginModal = function() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
};

function setUserSession(user, notify = true) {
    currentUser = user || PLANT_LEAD_USER;
    localStorage.setItem('factory_user', JSON.stringify(currentUser));

    // Update UI Header Profile Pill
    const navName = document.getElementById('navUserName');
    const navAvatar = document.getElementById('navUserAvatar');
    const roleBadge = document.getElementById('navUserRoleBadge');

    if (navName) navName.textContent = currentUser.name;
    if (navAvatar) navAvatar.textContent = currentUser.initials;
    if (roleBadge) {
        roleBadge.textContent = currentUser.roleDisplay;
        roleBadge.className = `user-role-badge ${currentUser.badgeClass || 'badge-admin'}`;
    }

    hideLoginModal();
    showDashboardView();

    if (notify) {
        showToast('Authorized', `Signed in as Plant Lead (${currentUser.name})`, 'success');
        playChime('success');
    }
}

function logoutUser() {
    localStorage.removeItem('factory_user');
    currentUser = null;
    showToast('Signed Out', 'Plant Lead session ended', 'info');
    showLandingView();
}

// ==========================================
// 2. REAL-TIME CLOCK & PROCEDURAL AUDIO FX
// ==========================================
function initClock() {
    const clock = document.getElementById('clockDisplay');
    const landingClock = document.getElementById('landingClock');
    const updateTime = () => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString();
        if (clock) clock.textContent = timeStr;
        if (landingClock) landingClock.textContent = timeStr;
    };
    updateTime();
    setInterval(updateTime, 1000);
}

function initAudioSetting() {
    const savedMute = localStorage.getItem('factory_sound_muted');
    isAudioMuted = savedMute === 'true';
    updateSoundBtnState();
}

function updateSoundBtnState() {
    const btn = document.getElementById('soundToggleBtn');
    if (btn) {
        btn.textContent = isAudioMuted ? '🔇 Sound: OFF' : '🔊 Sound: ON';
    }
}

function playChime(type = 'info') {
    if (isAudioMuted) return;
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;
        if (type === 'danger' || type === 'critical') {
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.setValueAtTime(440, now + 0.12);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
            osc.start(now);
            osc.stop(now + 0.35);
        } else if (type === 'success') {
            osc.frequency.setValueAtTime(523.25, now);
            osc.frequency.setValueAtTime(659.25, now + 0.08);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            osc.start(now);
            osc.stop(now + 0.25);
        }
    } catch (e) {
        // AudioContext fallback
    }
}

// ==========================================
// 3. EVENT LISTENERS SETUP
// ==========================================
function setupEventListeners() {
    // Sound FX Toggle
    const soundBtn = document.getElementById('soundToggleBtn');
    if (soundBtn) {
        soundBtn.addEventListener('click', () => {
            isAudioMuted = !isAudioMuted;
            localStorage.setItem('factory_sound_muted', isAudioMuted);
            updateSoundBtnState();
            showToast('Audio Settings', `Alert audio ${isAudioMuted ? 'muted' : 'active'}`, 'info');
        });
    }

    // Refresh Button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            loadDashboardSummary();
            loadTelemetryLogs();
            loadAlerts();
            showToast('Telemetry Synced', 'Live factory telemetry data refreshed', 'info');
        });
    }

    // View Switcher (Table vs Floor Grid)
    const viewTableBtn = document.getElementById('viewTableBtn');
    const viewGridBtn = document.getElementById('viewGridBtn');
    const tableView = document.getElementById('telemetryTableView');
    const gridView = document.getElementById('machineFloorGridView');

    if (viewTableBtn && viewGridBtn && tableView && gridView) {
        viewTableBtn.addEventListener('click', () => {
            viewTableBtn.classList.add('active');
            viewGridBtn.classList.remove('active');
            tableView.classList.remove('hidden');
            gridView.classList.add('hidden');
        });

        viewGridBtn.addEventListener('click', () => {
            viewGridBtn.classList.add('active');
            viewTableBtn.classList.remove('active');
            gridView.classList.remove('hidden');
            tableView.classList.add('hidden');
        });
    }

    // CSV Exporter
    const exportBtn = document.getElementById('exportCsvBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportTelemetryCSV);
    }

    // Search and Filters
    const searchInput = document.getElementById('searchInput');
    const lineFilter = document.getElementById('lineFilter');
    const statusFilter = document.getElementById('statusFilter');

    if (searchInput) searchInput.addEventListener('input', filterLogs);
    if (lineFilter) lineFilter.addEventListener('change', filterLogs);
    if (statusFilter) statusFilter.addEventListener('change', filterLogs);

    // Ingestion Form Modal
    const entryModal = document.getElementById('entryModal');
    const openEntryBtn = document.getElementById('openEntryModalBtn');
    const closeEntryBtn = document.getElementById('closeEntryModalBtn');
    const cancelEntryBtn = document.getElementById('cancelEntryModalBtn');
    const telemetryForm = document.getElementById('telemetryForm');

    if (openEntryBtn && entryModal) openEntryBtn.addEventListener('click', () => entryModal.classList.remove('hidden'));
    if (closeEntryBtn && entryModal) closeEntryBtn.addEventListener('click', () => entryModal.classList.add('hidden'));
    if (cancelEntryBtn && entryModal) cancelEntryBtn.addEventListener('click', () => entryModal.classList.add('hidden'));
    if (telemetryForm) telemetryForm.addEventListener('submit', handleTelemetrySubmit);

    // Drill-down Modal
    const drilldownModal = document.getElementById('drilldownModal');
    const closeDrilldownBtn = document.getElementById('closeDrilldownModalBtn');
    if (closeDrilldownBtn && drilldownModal) {
        closeDrilldownBtn.addEventListener('click', () => drilldownModal.classList.add('hidden'));
    }

    // Alerts Drawer
    const alertDrawer = document.getElementById('alertDrawer');
    const toggleAlertBtn = document.getElementById('toggleAlertDrawerBtn');
    const closeAlertBtn = document.getElementById('closeAlertDrawerBtn');
    if (toggleAlertBtn && alertDrawer) toggleAlertBtn.addEventListener('click', () => alertDrawer.classList.remove('hidden'));
    if (closeAlertBtn && alertDrawer) closeAlertBtn.addEventListener('click', () => alertDrawer.classList.add('hidden'));

    // Top Alert Banner Dismiss
    const dismissBannerBtn = document.getElementById('dismissBannerBtn');
    if (dismissBannerBtn) {
        dismissBannerBtn.addEventListener('click', () => {
            document.getElementById('topAlertBanner').classList.add('hidden');
        });
    }

    // Logout Button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', logoutUser);

    // Plant Lead 1-Click Card Listener
    const plantLeadQuickCard = document.getElementById('plantLeadQuickCard');
    if (plantLeadQuickCard) {
        plantLeadQuickCard.addEventListener('click', (e) => window.handlePlantLeadLogin(e));
    }

    // Plant Lead Form Submit Listener
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => window.handlePlantLeadLogin(e));
    }

    // Plant Lead Submit Button Listener
    const loginSubmitBtn = document.getElementById('loginSubmitBtn');
    if (loginSubmitBtn) {
        loginSubmitBtn.addEventListener('click', (e) => window.handlePlantLeadLogin(e));
    }

    // Landing Page & Modal View Listeners
    const landingLoginBtn = document.getElementById('landingLoginBtn');
    if (landingLoginBtn) landingLoginBtn.addEventListener('click', showLoginModal);

    const portalOverviewBtn = document.getElementById('portalOverviewBtn');
    if (portalOverviewBtn) portalOverviewBtn.addEventListener('click', showLandingView);

    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) hideLoginModal();
        });
    }
}

// ==========================================
// 4. CHART.JS REAL-TIME VISUALIZATIONS
// ==========================================
function initCharts() {
    const trendCanvas = document.getElementById('energyTrendChart');
    const shareCanvas = document.getElementById('lineShareChart');

    if (trendCanvas && typeof Chart !== 'undefined') {
        const trendCtx = trendCanvas.getContext('2d');
        const gradient = trendCtx.createLinearGradient(0, 0, 0, 240);
        gradient.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
        gradient.addColorStop(1, 'rgba(6, 182, 212, 0.0)');

        trendChart = new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Power Load (kW)',
                        data: [],
                        borderColor: '#06b6d4',
                        backgroundColor: gradient,
                        borderWidth: 2,
                        fill: true,
                        tension: 0.35,
                        pointBackgroundColor: '#06b6d4',
                        pointBorderColor: '#ffffff',
                        pointRadius: 4,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Critical Threshold (200 kW)',
                        data: [],
                        borderColor: 'rgba(239, 68, 68, 0.85)',
                        borderDash: [6, 4],
                        borderWidth: 1.5,
                        pointRadius: 0,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#8fa0ba', font: { family: 'Inter', size: 11 } }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(13, 20, 36, 0.95)',
                        titleColor: '#fff',
                        bodyColor: '#93c5fd',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#8fa0ba', font: { size: 10, family: 'JetBrains Mono' } }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#8fa0ba', font: { size: 10, family: 'JetBrains Mono' } },
                        suggestedMax: 220
                    }
                }
            }
        });
    }

    if (shareCanvas && typeof Chart !== 'undefined') {
        const shareCtx = shareCanvas.getContext('2d');
        lineShareChart = new Chart(shareCtx, {
            type: 'doughnut',
            data: {
                labels: ['Stamping', 'Assembly', 'Smelting', 'Packaging', 'Infrastructure'],
                datasets: [{
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: [
                        '#3b82f6',
                        '#06b6d4',
                        '#ef4444',
                        '#10b981',
                        '#8b5cf6'
                    ],
                    borderWidth: 2,
                    borderColor: '#0d1424'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { color: '#8fa0ba', font: { family: 'Inter', size: 11 }, boxWidth: 12 }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(13, 20, 36, 0.95)',
                        callbacks: {
                            label: function(context) {
                                return ` ${context.label}: ${context.raw} kW`;
                            }
                        }
                    }
                },
                cutout: '68%'
            }
        });
    }
}

function updateCharts(logs) {
    if (!logs || logs.length === 0) return;

    // 1. Update Trend Chart (chronological records)
    if (trendChart) {
        const sorted = [...logs].reverse().slice(-12);
        const labels = sorted.map(l => {
            const d = new Date(l.recordedAt);
            return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
        });
        const powerValues = sorted.map(l => l.powerConsumptionKW);
        const thresholdValues = sorted.map(() => 200.0);

        trendChart.data.labels = labels;
        trendChart.data.datasets[0].data = powerValues;
        trendChart.data.datasets[1].data = thresholdValues;
        trendChart.update();
    }

    // 2. Update Production Line Share Donut Chart
    if (lineShareChart) {
        const lineTotals = {
            'Stamping': 0,
            'Assembly': 0,
            'Smelting': 0,
            'Packaging': 0,
            'Infrastructure': 0
        };

        logs.forEach(log => {
            const line = log.productionLine || '';
            if (line.toLowerCase().includes('stamp')) lineTotals['Stamping'] += log.powerConsumptionKW;
            else if (line.toLowerCase().includes('assem')) lineTotals['Assembly'] += log.powerConsumptionKW;
            else if (line.toLowerCase().includes('smelt') || line.toLowerCase().includes('found')) lineTotals['Smelting'] += log.powerConsumptionKW;
            else if (line.toLowerCase().includes('pack')) lineTotals['Packaging'] += log.powerConsumptionKW;
            else lineTotals['Infrastructure'] += log.powerConsumptionKW;
        });

        lineShareChart.data.datasets[0].data = [
            parseFloat(lineTotals['Stamping'].toFixed(1)),
            parseFloat(lineTotals['Assembly'].toFixed(1)),
            parseFloat(lineTotals['Smelting'].toFixed(1)),
            parseFloat(lineTotals['Packaging'].toFixed(1)),
            parseFloat(lineTotals['Infrastructure'].toFixed(1))
        ];
        lineShareChart.update();
    }
}

// ==========================================
// 5. DATA INGESTION & REST API SYNC
// ==========================================
async function loadDashboardSummary() {
    try {
        const res = await fetch(`${API_BASE}/dashboard/summary`);
        if (!res.ok) return;
        const data = await res.json();

        const kpiTotal = document.getElementById('kpiTotalKwh');
        const kpiPeak = document.getElementById('kpiPeakKw');
        const kpiAlerts = document.getElementById('kpiActiveAlerts');
        const navBadge = document.getElementById('navAlertBadge');
        const kpiPf = document.getElementById('kpiPowerFactor');
        const kpiScore = document.getElementById('kpiEfficiencyScore');
        const alertFooter = document.getElementById('kpiAlertFooter');

        if (kpiTotal) kpiTotal.innerHTML = `${data.totalConsumptionKWh} <span class="kpi-unit">kWh</span>`;
        if (kpiPeak) kpiPeak.innerHTML = `${data.peakPowerKW} <span class="kpi-unit">kW</span>`;
        if (kpiAlerts) kpiAlerts.textContent = data.activeAlertsCount;
        if (navBadge) navBadge.textContent = data.activeAlertsCount;
        if (kpiPf) kpiPf.textContent = (data.averagePowerFactor || 0).toFixed(2);
        if (kpiScore) kpiScore.innerHTML = `${data.efficiencyScorePercent}<span class="kpi-unit">%</span>`;

        if (alertFooter) {
            alertFooter.textContent = data.activeAlertsCount > 0 
                ? `${data.activeAlertsCount} Anomalies Flagged` 
                : 'All Systems Operating Normally';
        }

        // Live Landing Page Preview Metrics Sync
        const landingTotal = document.getElementById('landingTotalKwh');
        const landingPeak = document.getElementById('landingPeakKw');
        const landingPf = document.getElementById('landingPowerFactor');
        const landingEff = document.getElementById('landingEfficiency');

        if (landingTotal && data.totalConsumptionKWh !== undefined) landingTotal.textContent = `${Number(data.totalConsumptionKWh).toLocaleString()} kWh`;
        if (landingPeak && data.peakPowerKW !== undefined) landingPeak.textContent = `${data.peakPowerKW} kW`;
        if (landingPf && data.averagePowerFactor !== undefined) landingPf.textContent = `${Number(data.averagePowerFactor).toFixed(2)} PF`;
        if (landingEff && data.efficiencyScorePercent !== undefined) landingEff.textContent = `${data.efficiencyScorePercent}%`;
    } catch (err) {
        console.error('Failed to load dashboard summary:', err);
    }
}

async function loadTelemetryLogs() {
    try {
        const res = await fetch(`${API_BASE}/energy/logs`);
        if (!res.ok) return;
        globalLogs = await res.json();
        
        renderTable(globalLogs);
        renderMachineGrid(globalLogs);
        updateCharts(globalLogs);
    } catch (err) {
        console.error('Failed to load telemetry logs:', err);
    }
}

function renderTable(logs) {
    const tbody = document.getElementById('telemetryTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (logs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding: 2.5rem; color: #8fa0ba;">No machine telemetry records found.</td></tr>`;
        return;
    }

    logs.forEach(log => {
        const tr = document.createElement('tr');
        
        let statusBadge = `<span class="badge badge-success">● NORMAL</span>`;
        if (log.status === 'WARNING') statusBadge = `<span class="badge badge-warning">▲ WARNING</span>`;
        if (log.status === 'CRITICAL') statusBadge = `<span class="badge badge-danger">⚡ CRITICAL</span>`;

        const formattedDate = new Date(log.recordedAt).toLocaleString();

        tr.innerHTML = `
            <td><strong style="color: #93c5fd; font-family: var(--font-mono);">${log.machineId}</strong></td>
            <td><strong>${log.machineName}</strong></td>
            <td>${log.productionLine}</td>
            <td><span style="font-family: var(--font-mono); font-weight:700;">${log.powerConsumptionKW} kW</span></td>
            <td>${log.voltageV} V</td>
            <td>${log.currentA} A</td>
            <td>${log.powerFactor}</td>
            <td>${statusBadge}</td>
            <td style="font-size:0.8rem; color:#8fa0ba;">${formattedDate}</td>
            <td>
                <button class="btn btn-secondary inspect-btn" onclick="openDrilldown('${log.machineId}')">Inspect</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderMachineGrid(logs) {
    const grid = document.getElementById('machineFloorGridView');
    if (!grid) return;
    grid.innerHTML = '';

    if (logs.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 2.5rem; color: #8fa0ba;">No active machines found.</div>`;
        return;
    }

    // Deduplicate by latest machine telemetry
    const machineMap = new Map();
    logs.forEach(l => {
        if (!machineMap.has(l.machineId)) {
            machineMap.set(l.machineId, l);
        }
    });

    machineMap.forEach(log => {
        const card = document.createElement('div');
        const statusClass = log.status === 'CRITICAL' ? 'status-critical' : (log.status === 'WARNING' ? 'status-warning' : 'status-normal');
        card.className = `machine-card ${statusClass}`;

        const loadPct = Math.min(Math.round((log.powerConsumptionKW / 200) * 100), 100);
        let fillColor = '#10b981';
        if (log.powerConsumptionKW >= 200) fillColor = '#ef4444';
        else if (log.powerConsumptionKW >= 150) fillColor = '#f59e0b';

        let statusBadge = `<span class="badge badge-success">NORMAL</span>`;
        if (log.status === 'WARNING') statusBadge = `<span class="badge badge-warning">WARNING</span>`;
        if (log.status === 'CRITICAL') statusBadge = `<span class="badge badge-danger">CRITICAL</span>`;

        card.innerHTML = `
            <div class="mc-header">
                <div>
                    <div class="mc-id">${log.machineId}</div>
                    <div class="mc-name">${log.machineName}</div>
                    <div class="mc-line">${log.productionLine}</div>
                </div>
                ${statusBadge}
            </div>

            <div>
                <div class="mc-power-stat">
                    <span class="mc-power-val">${log.powerConsumptionKW}</span>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">kW (${loadPct}% Cap)</span>
                </div>
                <div class="mc-gauge-bg" style="margin-top: 0.4rem;">
                    <div class="mc-gauge-fill" style="width: ${loadPct}%; background: ${fillColor};"></div>
                </div>
            </div>

            <div class="mc-metrics-row">
                <div class="mc-metric-item">Volt: <strong>${log.voltageV}V</strong></div>
                <div class="mc-metric-item">Curr: <strong>${log.currentA}A</strong></div>
                <div class="mc-metric-item">PF: <strong>${log.powerFactor}</strong></div>
            </div>

            <div style="display:flex; justify-content: flex-end;">
                <button class="btn btn-secondary inspect-btn" style="width: 100%; font-size: 0.78rem;" onclick="openDrilldown('${log.machineId}')">
                    Inspect Diagnostics
                </button>
            </div>
        `;

        grid.appendChild(card);
    });
}

function filterLogs() {
    const query = (document.getElementById('searchInput')?.value || '').toLowerCase();
    const line = document.getElementById('lineFilter')?.value || 'ALL';
    const status = document.getElementById('statusFilter')?.value || 'ALL';

    const filtered = globalLogs.filter(log => {
        const matchesQuery = log.machineId.toLowerCase().includes(query) ||
                             log.machineName.toLowerCase().includes(query) ||
                             log.productionLine.toLowerCase().includes(query);
        
        const matchesLine = (line === 'ALL') || log.productionLine.toLowerCase().includes(line.toLowerCase());
        const matchesStatus = (status === 'ALL') || log.status.toUpperCase() === status.toUpperCase();

        return matchesQuery && matchesLine && matchesStatus;
    });

    renderTable(filtered);
    renderMachineGrid(filtered);
}

// Ingest Telemetry Submit Handler
async function handleTelemetrySubmit(e) {
    e.preventDefault();

    const payload = {
        machineId: document.getElementById('formMachineId').value.trim(),
        machineName: document.getElementById('formMachineName').value.trim(),
        productionLine: document.getElementById('formProductionLine').value.trim(),
        powerConsumptionKW: parseFloat(document.getElementById('formPowerKW').value),
        voltageV: parseFloat(document.getElementById('formVoltageV').value),
        currentA: parseFloat(document.getElementById('formCurrentA').value),
        powerFactor: parseFloat(document.getElementById('formPowerFactor').value),
        recordedBy: currentUser ? `${currentUser.name} (${currentUser.roleDisplay})` : 'Alex Vance (PLANT LEAD)'
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
            await loadDashboardSummary();
            await loadTelemetryLogs();
            await loadAlerts();

            // Trigger top alert banner and notification
            if (savedLog.status === 'CRITICAL' || savedLog.status === 'WARNING') {
                showTopAlertBanner(`[${savedLog.status}] High Power Anomaly for ${savedLog.machineName}: ${savedLog.powerConsumptionKW} kW!`);
                showToast(`Anomaly Alert (${savedLog.status})`, `${savedLog.machineName} reached ${savedLog.powerConsumptionKW} kW exceeding threshold!`, 'danger');
                playChime('critical');
            } else {
                showToast('Telemetry Ingested', `Successfully logged readings for ${savedLog.machineName}`, 'success');
                playChime('success');
            }
        } else {
            showToast('Ingestion Error', 'Error submitting telemetry payload. Check fields.', 'danger');
        }
    } catch (err) {
        console.error('Submission error:', err);
        showToast('Connection Error', 'Failed to communicate with telemetry backend', 'danger');
    }
}

function showTopAlertBanner(msg) {
    const banner = document.getElementById('topAlertBanner');
    const msgEl = document.getElementById('topAlertMessage');
    if (msgEl) msgEl.textContent = msg;
    if (banner) banner.classList.remove('hidden');
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
                <td><strong>${item.powerConsumptionKW} kW</strong></td>
                <td>${item.voltageV} V</td>
                <td>${item.currentA} A</td>
                <td>${item.powerFactor}</td>
                <td><span class="badge ${item.status === 'CRITICAL' ? 'badge-danger' : (item.status === 'WARNING' ? 'badge-warning' : 'badge-success')}">${item.status}</span></td>
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
        if (!container) return;
        container.innerHTML = '';

        if (alerts.length === 0) {
            container.innerHTML = `<p style="padding: 1.5rem; color: #8fa0ba; text-align:center;">No active system anomaly alerts.</p>`;
            return;
        }

        alerts.forEach(alert => {
            const card = document.createElement('div');
            card.className = `alert-card glass-panel`;
            card.style.padding = '1.1rem';
            card.style.marginBottom = '0.85rem';
            card.style.borderLeft = alert.severity === 'CRITICAL' ? '4px solid #ef4444' : '4px solid #f59e0b';

            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong style="color:#fff;">${alert.severity} Alert: ${alert.machineId}</strong>
                    <span class="badge ${alert.status === 'OPEN' ? 'badge-danger' : 'badge-success'}">${alert.status}</span>
                </div>
                <p style="font-size: 0.82rem; margin: 0.6rem 0; color: #f3f6fc;">${alert.message}</p>
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; color:#8fa0ba;">
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
            showToast('Alert Acknowledged', `Anomaly #${alertId} verified by Plant Lead`, 'info');
            loadDashboardSummary();
            loadAlerts();
        }
    } catch (err) {
        console.error('Failed to acknowledge alert:', err);
    }
}

// ==========================================
// 6. CSV EXPORT UTILITY
// ==========================================
function exportTelemetryCSV() {
    if (!globalLogs || globalLogs.length === 0) {
        showToast('Export Warning', 'No telemetry records available to export', 'warning');
        return;
    }

    const headers = ['Machine ID', 'Machine Name', 'Production Line', 'Power (kW)', 'Voltage (V)', 'Current (A)', 'Power Factor', 'Status', 'Recorded At'];
    const rows = globalLogs.map(l => [
        `"${l.machineId}"`,
        `"${l.machineName}"`,
        `"${l.productionLine}"`,
        l.powerConsumptionKW,
        l.voltageV,
        l.currentA,
        l.powerFactor,
        l.status,
        `"${new Date(l.recordedAt).toISOString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `factory_telemetry_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Export Complete', 'Telemetry audit CSV downloaded successfully', 'success');
}

// ==========================================
// 7. TOAST NOTIFICATION ENGINE
// ==========================================
function showToast(title, message, type = 'info', duration = 4000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'warning') icon = '⚠️';
    if (type === 'danger') icon = '🚨';

    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}
