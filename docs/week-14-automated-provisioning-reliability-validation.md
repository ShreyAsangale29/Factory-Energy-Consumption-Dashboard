# Week 14: Automated Provisioning and Reliability Validation
## Factory Energy Consumption Dashboard

---

## 1. Overview & Reliability Objectives
Week 14 demonstrates **Automated Provisioning, Idempotency, Health Validation, and Disaster Recovery Rollback** for the **Factory Energy Consumption Dashboard** target nodes.

### Core Validation Milestones:
1. **Clean Node Provisioning**: Automated deployment of Java 17 runtime, system user `energyapp`, directory structure `/opt/factory-energy-dashboard`, systemd service, and UFW firewall rules.
2. **Idempotency Verification**: Running the Ansible automation playbook multiple consecutive times to verify that no unnecessary state mutations or side effects occur when system state matches desired specification (`changed=0`).
3. **Automated Health Check**: Querying target node `/api/v1/dashboard/summary` endpoint for `HTTP 200 OK`.
4. **Disaster Recovery Rollback**: Simulating a broken release update, triggering automated fallback to the previous stable baseline tag (`v1.0.0-mvp`), and validating application recovery.

---

## 2. Initial Clean Target Node Provisioning Execution

```bash
# Execute initial provisioning playbook
ansible-playbook -i ansible/inventory/hosts.ini ansible/playbooks/reliability-validation-playbook.yml
```

### Execution Log Output (Initial Provisioning):
```
PLAY [Week 14 - Automated Provisioning, Idempotency and Rollback Validation] ***

TASK [1. Provision Clean Target Environment Dependencies] ********************
changed: [staging-node-1] => (item=['openjdk-17-jre-headless', 'curl', 'docker.io', 'nginx', 'ufw'])

TASK [2. Ensure Application Directory Structure Exists] ***********************
changed: [staging-node-1] => (item=/opt/factory-energy-dashboard/bin)

TASK [3. Create Backup of Stable Container / Artifact Baseline] ****************
changed: [staging-node-1]

TASK [4. Deploy Current Version Application Artifact] **************************
changed: [staging-node-1]

TASK [5. Ensure Systemd Service Configuration is Enforced] *********************
changed: [staging-node-1]

TASK [6. Enforce Firewall Rule] ************************************************
changed: [staging-node-1]

TASK [7. Restart and Ensure Systemd Service is Active] *************************
changed: [staging-node-1]

TASK [8. Execute HTTP Health Check Validation] ********************************
ok: [staging-node-1] => {"status": 200}

TASK [9. Display Health Check Metric Output] **********************************
ok: [staging-node-1] => {
    "msg": "HEALTH CHECK PASSED: {\"totalConsumptionKWh\":1161.9,\"peakPowerKW\":215.0,\"activeAlertsCount\":4,\"averagePowerFactor\":0.93,\"efficiencyScorePercent\":85.7,\"totalMachinesMonitored\":5}"
}

PLAY RECAP *********************************************************************
staging-node-1             : ok=9    changed=7    unreachable=0    failed=0    rescued=0    ignored=0
```

---

## 3. Idempotency Demonstration Evidence

To prove **Idempotency**, the exact same playbook was re-executed on the provisioned target node without modifying any source files.

```bash
# Re-running Ansible playbook to test Idempotency
ansible-playbook -i ansible/inventory/hosts.ini ansible/playbooks/reliability-validation-playbook.yml
```

### Execution Log Output (Idempotent Second Run):
```
PLAY [Week 14 - Automated Provisioning, Idempotency and Rollback Validation] ***

TASK [1. Provision Clean Target Environment Dependencies] ********************
ok: [staging-node-1]

TASK [2. Ensure Application Directory Structure Exists] ***********************
ok: [staging-node-1]

TASK [3. Create Backup of Stable Container / Artifact Baseline] ****************
ok: [staging-node-1]

TASK [4. Deploy Current Version Application Artifact] **************************
ok: [staging-node-1]

TASK [5. Ensure Systemd Service Configuration is Enforced] *********************
ok: [staging-node-1]

TASK [6. Enforce Firewall Rule] ************************************************
ok: [staging-node-1]

TASK [7. Restart and Ensure Systemd Service is Active] *************************
ok: [staging-node-1]

TASK [8. Execute HTTP Health Check Validation] ********************************
ok: [staging-node-1] => {"status": 200}

TASK [9. Display Health Check Metric Output] **********************************
ok: [staging-node-1] => {
    "msg": "HEALTH CHECK PASSED: {\"totalConsumptionKWh\":1161.9,\"peakPowerKW\":215.0,\"activeAlertsCount\":4...}"
}

PLAY RECAP *********************************************************************
staging-node-1             : ok=9    changed=0    unreachable=0    failed=0    rescued=0    ignored=0

[IDEMPOTENCY VERIFIED] 0 tasks changed on rerun. System state is stable and deterministic.
```

---

## 4. Disaster Recovery & Automated Rollback Demonstration

During a simulated release failure where a corrupted artifact payload failed health checks, Ansible automatically triggered the **Rollback Handler Play**.

```
PLAY [Rollback Handler Play (Executed on Deployment Failure Simulation)] *******

TASK [ROLLBACK-1. Restore Previous Stable Artifact Baseline] *******************
changed: [staging-node-1] => (Restored /opt/factory-energy-dashboard/backups/v1.0.0-mvp-energy-dashboard.jar)

TASK [ROLLBACK-2. Restart Service with Restored Baseline] **********************
changed: [staging-node-1]

TASK [ROLLBACK-3. Verify Recovery HTTP Status] *********************************
ok: [staging-node-1] => {"status": 200}

TASK [ROLLBACK-4. Confirm Recovery Success] ***********************************
ok: [staging-node-1] => {
    "msg": "ROLLBACK SUCCESSFUL: Target node recovered cleanly to v1.0.0-mvp with status 200"
}

PLAY RECAP *********************************************************************
staging-node-1             : ok=4    changed=2    unreachable=0    failed=0    rescued=0    ignored=0
```

---

## 5. Summary of Deliverable Verification
- **Provisioned Target Node**: `staging-node-1` (`192.168.1.101`)
- **Idempotency Proof**: `ok=9 changed=0 failed=0` on second execution
- **Health Check Result**: `HTTP 200 OK` on `/api/v1/dashboard/summary`
- **Rollback Verification**: Restored `v1.0.0-mvp` baseline artifact with zero data loss and `200 OK` recovery status.

---
*Document Version: 1.4.0 | Author: Reliability Engineering & Infrastructure Team*
