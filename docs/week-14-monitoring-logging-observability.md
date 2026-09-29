# Week 14: Monitoring, Logging and Observability
## Factory Energy Consumption Dashboard

---

## 1. Observability Architecture Overview
Week 14 establishes full system observability for the **Factory Energy Consumption Dashboard** across metrics, telemetry logs, and real-time alert dispatches.

---

## 2. Key Observability Components

### 1. Prometheus Metrics Endpoint
- Integrated Spring Boot Actuator with Micrometer Prometheus registry (`/actuator/prometheus`).
- Exposes real-time JVM garbage collection, HTTP request latency, active database connections, and custom business metrics (`factory_energy_total_kwh_sum`, `factory_active_alerts_total`).

### 2. Log Aggregation & Centralized Logging
- Standardized JSON structured logging output for container log collectors (Fluentd / Logstash / Docker logs).
- Trace IDs attached to all REST telemetry requests.

### 3. Alert Notification Webhooks
- Automated webhook dispatch to Slack/Teams channels whenever critical power breaches occur (> 200 kW).

---

## 3. Prometheus Metric Export Sample

```
# HELP factory_energy_total_kwh_sum Total factory energy consumption in kWh
# TYPE factory_energy_total_kwh_sum gauge
factory_energy_total_kwh_sum 1161.9

# HELP factory_active_alerts_total Current active system alerts count
# TYPE factory_active_alerts_total gauge
factory_active_alerts_total{severity="CRITICAL"} 2
factory_active_alerts_total{severity="WARNING"} 2

# HELP http_server_requests_seconds HTTP request latency distribution
http_server_requests_seconds_count{uri="/api/v1/energy/logs",status="200"} 48
http_server_requests_seconds_sum{uri="/api/v1/energy/logs",status="200"} 1.452
```

---
*Document Version: 1.4.0 | Reliability Engineering Team*
