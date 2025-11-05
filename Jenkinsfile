pipeline {
    agent any
    
    // Environment variables
    environment {
        NODE_VERSION = '18'
        PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = '0'
    }
    
    // Build parameters
    parameters {
        choice(
            name: 'BROWSER',
            choices: ['chromium', 'firefox', 'webkit', 'all'],
            description: 'Select browser for test execution'
        )
        booleanParam(
            name: 'HEADED_MODE',
            defaultValue: false,
            description: 'Run tests in headed mode'
        )
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from repository...'
                checkout scm
            }
        }
        
        stage('Setup') {
            steps {
                echo 'Setting up Node.js and installing dependencies...'
                sh '''
                    node --version
                    npm --version
                    npm ci
                '''
            }
        }
        
        stage('Install Browsers') {
            steps {
                echo 'Installing Playwright browsers...'
                sh 'npx playwright install --with-deps'
            }
        }
        
        stage('Run Tests') {
            steps {
                script {
                    def testCommand = 'npm test'
                    
                    if (params.BROWSER != 'all') {
                        testCommand = "npm test -- --project=${params.BROWSER}"
                    }
                    
                    if (params.HEADED_MODE) {
                        testCommand += ' --headed'
                    }
                    
                    echo "Executing: ${testCommand}"
                    sh testCommand
                }
            }
        }
        
        stage('Generate Report') {
            steps {
                echo 'Generating test report...'
                sh 'npx playwright show-report --host 0.0.0.0 || true'
            }
        }
    }
    
    post {
        always {
            echo 'Archiving test results and reports...'
            
            // Archive test results
            junit testResults: 'test-results/junit.xml', allowEmptyResults: true
            
            // Archive HTML report
            publishHTML([
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Test Report'
            ])
            
            // Archive screenshots and videos
            archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
            archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
        }
        
        success {
            echo 'Pipeline executed successfully!'
        }
        
        failure {
            echo 'Pipeline failed! Check logs for details.'
        }
        
        cleanup {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
    }
}
