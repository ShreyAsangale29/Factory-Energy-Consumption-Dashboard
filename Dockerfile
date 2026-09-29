# Production Dockerfile for Factory Energy Consumption Dashboard
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create non-root system user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy pre-packaged executable JAR and static frontend resources
COPY backend/target/energy-dashboard-0.0.1-SNAPSHOT.jar app.jar
COPY frontend /app/frontend

EXPOSE 8085
USER appuser

ENTRYPOINT ["java", "-jar", "app.jar"]
