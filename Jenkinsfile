pipeline {
    agent any

    parameters {
        choice(name: 'DEPLOY_ENV', choices: ['staging', 'production'], description: 'Target Deployment Environment')
        string(name: 'SERVER_PORT', defaultValue: '8080', description: 'Application Server HTTP Port')
    }

    environment {
        APP_NAME = 'factory-energy-dashboard'
        JAR_FILE = 'backend/target/energy-dashboard-0.0.1-SNAPSHOT.jar'
    }

    stages {
        stage('Checkout Source') {
            steps {
                echo "Checking out branch ${env.BRANCH_NAME}..."
                checkout scm
            }
        }

        stage('Build & Package') {
            steps {
                echo 'Compiling Java application and packaging JAR via Maven...'
                dir('backend') {
                    sh 'mvn clean package -DskipTests=true'
                }
            }
        }

        stage('Execute Unit & Integration Tests') {
            steps {
                echo 'Running JUnit backend integration test suite...'
                dir('backend') {
                    sh 'mvn test'
                }
            }
            post {
                always {
                    junit 'backend/target/surefire-reports/*.xml'
                }
            }
        }

        stage('Continuous UI Testing (Selenium)') {
            steps {
                echo 'Executing Selenium Headless E2E Browser Test Suite...'
                dir('backend') {
                    sh 'mvn test -Dtest=FactoryDashboardSeleniumTest'
                }
            }
            post {
                always {
                    junit 'backend/target/surefire-reports/TEST-*.xml'
                    archiveArtifacts artifacts: 'backend/target/test-screenshots/*.png', allowEmptyArchive: true
                }
                failure {
                    echo '[CRITICAL ALERT] Selenium test suite failed! Halting pipeline deployment.'
                }
            }
        }

        stage('Deploy Application Server') {
            steps {
                echo "Deploying ${env.APP_NAME} to ${params.DEPLOY_ENV} on port ${params.SERVER_PORT}..."
                sh """
                    echo "Checking for running instance..."
                    pkill -f ${env.APP_NAME} || true
                    echo "Starting application process..."
                    nohup java -Dserver.port=${params.SERVER_PORT} -jar ${env.JAR_FILE} > app.log 2>&1 &
                    sleep 5
                """
            }
        }

        stage('Verify Health Check') {
            steps {
                echo 'Pinging application health endpoint...'
                sh """
                    curl -s -f http://localhost:${params.SERVER_PORT}/api/v1/dashboard/summary || exit 1
                """
            }
        }
    }

    post {
        success {
            echo "Pipeline completed successfully! Application deployed at http://localhost:${params.SERVER_PORT}"
        }
        failure {
            echo "Pipeline failed! Please inspect logs and test failure screenshots."
        }
    }
}
