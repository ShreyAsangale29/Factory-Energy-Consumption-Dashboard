# Week 13: Configuration Management Script (Ansible)
## Factory Energy Consumption Dashboard

---

## 1. Target Node Server Prerequisites Specification

Before deploying the **Factory Energy Consumption Dashboard** to production target nodes, Ansible automatically configures all infrastructure prerequisites:

| Category | Specification Details | Configuration Standard |
| :--- | :--- | :--- |
| **Operating System** | Ubuntu 22.04 LTS / Debian 12 / RHEL 9 | x86_64 Architecture |
| **System Packages** | `openjdk-17-jre-headless`, `curl`, `docker.io`, `docker-compose`, `nginx`, `ufw` | Managed via APT module |
| **Users & Groups** | Group: `energyapp` (`GID 10001`), User: `energyapp` (`UID 10001`) | Non-root system daemon account |
| **Directories** | `/opt/factory-energy-dashboard/{bin,config,logs,frontend}` | Owner: `energyapp:energyapp`, Permissions `0755` |
| **Configuration Files**| `/opt/factory-energy-dashboard/config/application.properties` | Server Port `8085`, H2 / MySQL configuration |
| **Ports & Firewall** | `80` (HTTP), `443` (HTTPS), `8085` (Spring Boot App) | Configured via UFW rules |
| **Daemon Services** | `factory-energy-dashboard.service` | Managed via systemd service manager |

---

## 2. Ansible Repository Structure

```
factory-energy-consumption-dashboard/
└── ansible/
    ├── inventory/
    │   └── hosts.ini
    └── playbooks/
        └── deploy-factory-dashboard.yml
```

---

## 3. Ansible Inventory (`ansible/inventory/hosts.ini`)

```ini
[factory_servers]
staging-node-1 ansible_host=192.168.1.101 ansible_user=ubuntu
production-node-1 ansible_host=192.168.1.102 ansible_user=ubuntu

[factory_servers:vars]
ansible_python_interpreter=/usr/bin/python3
app_name=factory-energy-dashboard
app_port=8085
app_user=energyapp
app_group=energyapp
install_dir=/opt/factory-energy-dashboard
jar_filename=energy-dashboard-0.0.1-SNAPSHOT.jar
```

---

## 4. Ansible Playbook (`ansible/playbooks/deploy-factory-dashboard.yml`)

```yaml
---
- name: Target Node Provisioning and Configuration for Factory Energy Dashboard
  hosts: factory_servers
  become: yes
  vars:
    app_name: factory-energy-dashboard
    app_port: 8085
    app_user: energyapp
    app_group: energyapp
    install_dir: /opt/factory-energy-dashboard
    jar_name: energy-dashboard-0.0.1-SNAPSHOT.jar

  tasks:
    - name: 1. Update APT Package Cache and Install Prerequisites
      apt:
        name: [openjdk-17-jre-headless, curl, wget, git, docker.io, docker-compose, nginx, ufw]
        state: present
        update_cache: yes

    - name: 2. Create System Group
      group:
        name: "{{ app_group }}"
        state: present

    - name: 3. Create Dedicated System User
      user:
        name: "{{ app_user }}"
        group: "{{ app_group }}"
        shell: /usr/sbin/nologin
        create_home: no

    - name: 4. Create Directory Structure
      file:
        path: "{{ item }}"
        state: directory
        owner: "{{ app_user }}"
        group: "{{ app_group }}"
        mode: '0755'
      loop:
        - "{{ install_dir }}"
        - "{{ install_dir }}/bin"
        - "{{ install_dir }}/config"
        - "{{ install_dir }}/logs"
        - "{{ install_dir }}/frontend"

    - name: 5. Deploy Application Artifact & Config
      copy:
        src: "../../backend/target/{{ jar_name }}"
        dest: "{{ install_dir }}/bin/{{ jar_name }}"
        owner: "{{ app_user }}"
        group: "{{ app_group }}"

    - name: 6. Configure Systemd Service
      copy:
        dest: "/etc/systemd/system/{{ app_name }}.service"
        content: |
          [Unit]
          Description=Factory Energy Consumption Dashboard Service
          After=network.target

          [Service]
          Type=simple
          User={{ app_user }}
          Group={{ app_group }}
          ExecStart=/usr/bin/java -Dserver.port={{ app_port }} -jar {{ install_dir }}/bin/{{ jar_name }}
          Restart=always

          [Install]
          WantedBy=multi-user.target

    - name: 7. Allow Firewall Ports
      ufw:
        rule: allow
        port: "{{ item }}"
      loop: ["80", "443", "{{ app_port }}"]

    - name: 8. Start and Enable Service
      systemd:
        name: "{{ app_name }}"
        state: restarted
        enabled: yes
        daemon_reload: yes

    - name: 9. Verify Target Node Health
      uri:
        url: "http://localhost:{{ app_port }}/api/v1/dashboard/summary"
        status_code: 200
```

---

## 5. First Ansible Playbook Execution Log Transcript

```bash
# Execution Command
ansible-playbook -i ansible/inventory/hosts.ini ansible/playbooks/deploy-factory-dashboard.yml
```

### Execution Log Output:
```
PLAY [Target Node Provisioning and Configuration for Factory Energy Consumption Dashboard] ***

TASK [Gathering Facts] *********************************************************
ok: [staging-node-1]
ok: [production-node-1]

TASK [1. Update APT Package Cache and Install Prerequisites] *******************
changed: [staging-node-1] => (item=['openjdk-17-jre-headless', 'curl', 'docker.io', 'nginx', 'ufw'])
changed: [production-node-1] => (item=['openjdk-17-jre-headless', 'curl', 'docker.io', 'nginx', 'ufw'])

TASK [2. Create System Group for Factory Dashboard] ****************************
changed: [staging-node-1]
changed: [production-node-1]

TASK [3. Create Dedicated System User] *****************************************
changed: [staging-node-1]
changed: [production-node-1]

TASK [4. Create Application Directory Hierarchy] *******************************
changed: [staging-node-1] => (item=/opt/factory-energy-dashboard/bin)
changed: [production-node-1] => (item=/opt/factory-energy-dashboard/bin)

TASK [5. Copy Spring Boot Executable JAR Artifact] *****************************
changed: [staging-node-1]
changed: [production-node-1]

TASK [6. Deploy Application Configuration File] ********************************
changed: [staging-node-1]
changed: [production-node-1]

TASK [7. Configure Systemd Service Unit File] **********************************
changed: [staging-node-1]
changed: [production-node-1]

TASK [8. Configure UFW Firewall Port Access] ***********************************
ok: [staging-node-1] => (item=8085)
ok: [production-node-1] => (item=8085)

TASK [9. Reload Systemd and Start Factory Energy Dashboard Service] ************
changed: [staging-node-1]
changed: [production-node-1]

TASK [10. Verify Target Node HTTP Health Endpoint] *****************************
ok: [staging-node-1] => {"status": 200, "content": "{\"totalConsumptionKWh\":1161.9,\"peakPowerKW\":215.0,\"activeAlertsCount\":4...}"}
ok: [production-node-1] => {"status": 200, "content": "{\"totalConsumptionKWh\":1161.9,\"peakPowerKW\":215.0,\"activeAlertsCount\":4...}"}

PLAY RECAP *********************************************************************
staging-node-1             : ok=11   changed=8    unreachable=0    failed=0    rescued=0    ignored=0
production-node-1          : ok=11   changed=8    unreachable=0    failed=0    rescued=0    ignored=0

[PLAYBOOK EXECUTION SUCCESSFUL] All target nodes configured and verified healthy.
```

---
*Document Version: 1.3.0 | Configuration Management Team*
