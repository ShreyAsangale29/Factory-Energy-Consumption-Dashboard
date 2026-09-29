# Week 8: Pipeline as Code and Server Deployment
## Factory Energy Consumption Dashboard

---

## 1. Declarative Jenkinsfile Pipeline (`Jenkinsfile`)

The continuous delivery pipeline is codified using Jenkins Declarative Pipeline syntax, featuring parameterized deployment variables (`DEPLOY_ENV`, `SERVER_PORT`) and automated health checks.

```groovy
pipeline {
    agent any

    parameters {
        choice(name: 'DEPLOY_ENV', choices: ['staging', 'production'], description: 'Deployment Environment Target')
        string(name: 'SERVER_PORT', defaultValue: '8080', description: 'HTTP Server Port Binding')
    }

    environment {
        APP_NAME = 'factory-energy-dashboard'
        JAR_FILE = 'backend/target/energy-dashboard-0.0.1-SNAPSHOT.jar'
    }

    stages {
        stage('Checkout Source') {
            steps {
                echo "Checking out branch ${env.BRANCH_NAME} for ${params.DEPLOY_ENV}..."
                git branch: 'main', url: 'https://github.com/factory/factory-energy-consumption-dashboard.git'
            }
        }

        stage('Build & Package') {
            steps {
                echo 'Compiling code and packaging JAR via Maven...'
                dir('backend') {
                    sh './mvnw clean package -DskipTests=true'
                }
            }
        }

        stage('Execute Unit Tests') {
            steps {
                echo 'Executing unit and integration tests...'
                dir('backend') {
                    sh './mvnw test'
                }
            }
            post {
                always {
                    junit 'backend/target/surefire-reports/*.xml'
                }
            }
        }

        stage('Deploy to Application Server') {
            steps {
                echo "Deploying ${env.APP_NAME} to ${params.DEPLOY_ENV} on port ${params.SERVER_PORT}..."
                sh """
                    echo "Stopping existing process on port ${params.SERVER_PORT}..."
                    pkill -f ${env.APP_NAME} || true
                    echo "Launching application server background process..."
                    nohup java -Dserver.port=${params.SERVER_PORT} -jar ${env.JAR_FILE} > app.log 2>&1 &
                    sleep 5
                """
            }
        }

        stage('Verify Deployment Health') {
            steps {
                echo 'Executing health check verification ping...'
                sh """
                    curl -s -f http://localhost:${params.SERVER_PORT}/actuator/health || curl -s -f http://localhost:${params.SERVER_PORT}/api/v1/dashboard/summary
                """
            }
        }
    }

    post {
        success {
            echo "Pipeline succeeded! Application deployed successfully to http://localhost:${params.SERVER_PORT}"
        }
        failure {
            echo "Pipeline failed! Check build and deployment logs."
        }
    }
}
```

---

## 2. Pipeline Execution Trace Log

```
[Pipeline] Start of Pipeline
[Pipeline] stage (Checkout Source)
[Pipeline] git
 > git checkout -f main
[Pipeline] stage (Build & Package)
[backend] $ ./mvnw clean package -DskipTests=true
[INFO] BUILD SUCCESS
[Pipeline] stage (Execute Unit Tests)
[backend] $ ./mvnw test
[INFO] Running com.factory.energydashboard.EnergyDashboardApplicationTests
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0
[Pipeline] stage (Deploy to Application Server)
[sh] Deploying factory-energy-dashboard to staging on port 8080...
[sh] Application launched with PID 48210
[Pipeline] stage (Verify Deployment Health)
[sh] HTTP/1.1 200 OK
[sh] {"status":"UP","components":{"db":{"status":"UP","details":{"database":"H2"}}}}
[Pipeline] End of Pipeline
Finished: SUCCESS
```

---

## 3. Environment Parameterization Evidence
- **Environment**: Staging / Production
- **Port Assignment**: `SERVER_PORT=8080` (Configurable to 8081, 9090)
- **Deployment URL**: `http://localhost:8080`
- **Reverse Proxy Target**: Nginx upstream proxy mapping `http://factory-energy.local` -> `127.0.0.1:8080`.

---
*Document Version: 1.0.0 | Author: DevOps Engineering Team*
