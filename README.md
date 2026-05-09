# Telemetry Engine
 
A real-time data pipeline that ingests service metrics, processes them through Kafka, stores them in InfluxDB, and visualises everything live in Grafana.
 
---
 
## What does it actually do?
 
Imagine you're running six microservices in production — auth, payments, orders, and so on. Each one is constantly doing things: handling requests, consuming CPU, throwing errors. You want to know, in real time, when something goes wrong.
 
This engine does that. Services send a small JSON payload to an HTTP endpoint every time something happens. That payload gets validated, thrown onto a Kafka queue, picked up by a background worker, aggregated into 10-second summaries, and written to a time-series database. Grafana reads from that database and draws live charts.
 
If CPU on the payments service spikes above 90%, you see it on the dashboard within seconds. If latency on the auth service jumps, there's an alert in the logs.
 
The whole thing runs locally with one command.
 
---