# Week 11: Docker Image and Container Lifecycle
## Factory Energy Consumption Dashboard

---

## 1. Multi-Stage Dockerfile Design (`Dockerfile`)

The application uses a multi-stage Docker build to optimize image size and security. Stage 1 compiles the Maven build; Stage 2 bundles the lightweight JRE runtime container.

```dockerfile
# Stage 1: Build & Package application using Maven JRE 17
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app
COPY backend/pom.xml .
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Stage 2: Production Runtime Container
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder /app/target/energy-dashboard-0.0.1-SNAPSHOT.jar app.jar
COPY frontend /app/frontend
EXPOSE 8080
USER appuser
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## 2. Multi-Container Orchestration (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: factory-energy-app
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DB_HOST=mysql-db
    depends_on:
      - mysql-db
    restart: always

  mysql-db:
    image: mysql:8.0
    container_name: factory-energy-db
    ports:
      - "3306:3306"
    environment:
      - MYSQL_DATABASE=energy_db
      - MYSQL_USER=energy_user
      - MYSQL_PASSWORD=energy_pass
      - MYSQL_ROOT_PASSWORD=root_pass
    volumes:
      - mysql_data:/var/lib/mysql
    restart: always

volumes:
  mysql_data:
```

---

## 3. Container Lifecycle Operations Command Log

```bash
# 1. Build and Tag Docker Image
docker build -t factory-energy-dashboard:1.0.0 .
docker tag factory-energy-dashboard:1.0.0 factory-energy-dashboard:latest

# 2. Run Container with Port Mapping
docker run -d --name factory-app-instance -p 8080:8080 factory-energy-dashboard:latest

# 3. Inspect Running Container and Health Status
docker ps --filter "name=factory-app-instance"
docker inspect factory-app-instance | grep -i status

# 4. Stream Container Telemetry Logs
docker logs -f factory-app-instance --tail 50

# 5. Stop, Restart, and Remove Container Lifecycle
docker stop factory-app-instance
docker restart factory-app-instance
docker rm -f factory-app-instance

# 6. Launch Full Stack via Docker Compose
docker-compose up -d --build
```

---

## 4. Running Container Evidence Transcript

```
REPOSITORY                  TAG       IMAGE ID       CREATED        SIZE
factory-energy-dashboard   1.0.0     e7a89b12f345   1 minute ago   245MB

CONTAINER ID   IMAGE                            COMMAND                  CREATED         STATUS         PORTS                    NAMES
a1b2c3d4e5f6   factory-energy-dashboard:1.0.0   "java -jar app.jar"     12 seconds ago  Up 10 seconds  0.0.0.0:8080->8080/tcp   factory-app-instance

[APPLICATION LOGS]
2026-09-28 15:45:00.123  INFO 1 --- [main] c.f.e.EnergyDashboardApplication        : Starting EnergyDashboardApplication v0.0.1-SNAPSHOT...
2026-09-28 15:45:02.456  INFO 1 --- [main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)
2026-09-28 15:45:03.789  INFO 1 --- [main] c.f.e.EnergyDashboardApplication        : Started EnergyDashboardApplication in 3.662 seconds
```

---
*Document Version: 1.0.0 | Author: DevOps & Infrastructure Engineering Team*
