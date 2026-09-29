# Multi-Stage Build for Factory Energy Consumption Dashboard

# Stage 1: Build & Package application using Maven JDK 21
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app
COPY backend/pom.xml .
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime Container
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder /app/target/energy-dashboard-0.0.1-SNAPSHOT.jar app.jar
COPY frontend /app/frontend
EXPOSE 8080
USER appuser
ENTRYPOINT ["java", "-jar", "app.jar"]
