pipeline {
    agent any
    }
    stages {
        stage ('Build') {
            steps {
                echo "Build AngularUI4.0 Module"
                sh '''
                    npm install
                    node --max_old_space_size=8192 node_modules/@angular/cli/bin/ng build   --aot --build-optimizer --vendor-chunk=true --baseHref=/v1/
                '''
                mail to: "devops@reward360.co",
                subject: "${env.JOB_NAME} - Build # ${env.BUILD_NUMBER} - ${currentBuild.currentResult}!",
                body: "Build Is Created: ${currentBuild.currentResult}: Job ${env.JOB_NAME}\nMore Info can be found here: ${env.BUILD_URL} \n\n -------------------------------------------------- \n\n"
            }
        }
 /*       stage('SonarQube analysis') {
            steps {
                echo 'SonarQube analysis...'
                script {
                       sh '/var/opt/sonar-scanner-4.0.0.1744-linux/bin/sonar-scanner -Dsonar.host.url=http://localhost:9000/ -Dsonar.login=6a2198ca7d3d9996b7718c6863566de6cc32ff95 -Dsonar.projectKey=SmartBuy-HDFC_UAT_ANGULARUI4.0 -Dsonar.projectName=SmartBuy-HDFC_UAT_ANGULARUI4.0'
                }
            }
            post {
                success {
                    echo 'SonarQube analysis Report Uploading...'
                    emailext (
                        subject: "${env.JOB_NAME} - Build # ${env.BUILD_NUMBER} Jenkins-SonarQube analysis Report",
                        body: "SonarQube analysis Is Done For AngularUI4.0 Module. SonarQube analysis Report Is Uploaded On SonarQube Server - 'https://sonar.reward360.in:8443/'.  \n\n -------------------------------------------------- \n\n",
                        to: "devops@reward360.co, lakshmi@reward360.co, smartbuy.qa@reward360.co, tamil.selvan@reward360.co",
                    )
                }
                failure {
                    echo 'SonarQube analysis Failed...'
                    emailext (
                        subject: "${env.JOB_NAME} - Build # ${env.BUILD_NUMBER} Jenkins-SonarQube analysis Report",
                        body: 'SonarQube analysis Is Failed For AngularUI4.0 Module.  \n\n -------------------------------------------------- \n\n',
                        to: "devops@reward360.co, lakshmi@reward360.co, smartbuy.qa@reward360.co, tamil.selvan@reward360.co",
                    )
                }
            }
        }
        stage ('Deploy') {
            steps {
                script {
                    withCredentials([sshUserPrivateKey(credentialsId: 'HDFC_UAT_BackEnd_Remote_Server', keyFileVariable: 'identity', passphraseVariable: '', usernameVariable: 'centos')]) {
                      def remote = [:]
                      remote.user = 'apache'
                      remote.identityFile = identity
                      remote.name = "stagingr360sbubuntuappserver"
                      remote.host = "10.80.2.72"
                      remote.allowAnyHosts = true

                        echo "Removing Previous Backup Folder"
                        sshCommand remote: remote, command: 'rm -r /home/apache/git/backups/code_backup_AngularUI4.0_*'

                        echo "Creating Backup Folder"
                        sshCommand remote: remote, command: 'mkdir -p /home/apache/git/backups/code_backup_AngularUI4.0_`date +%Y%m%d`'

                        echo "Taking backup of AngularUI4.0 module has been done"
                        sshCommand remote: remote, command: 'rsync -avzru --no-perms --no-owner --no-group /var/www/html/smartbuy3.0/angularui4.0 /home/apache/git/backups/code_backup_AngularUI4.0_`date +%Y%m%d` --exclude="application/logs" --exclude=".git" --exclude="resources/temp" --exclude="uploads"  --exclude="OrderStatusFiles"'
                        echo "Backup Completed"

                        echo "Deploying the AngularUI4.0 Module"
                        sh 'rsync -avzr --no-perms --no-owner /var/lib/jenkins/workspace/HDFC-SMARTBUY-FRONTEND-PIPELINE-ANGULARUI4.0/ apache@10.80.2.72:/var/www/html/smartbuy3.0/angularui4.0/ --exclude=application/logs --exclude=.git --exclude=application/config/database.php --exclude=application/config/mongo_db.php --exclude=.env --exclude=config --exclude=storage'

                        echo "Deployment of AngularUI4.0 module has been done"
                    }
                }
            }
            post {
                success {
                    echo "AngularUI4.0 Module Deployed on UAT Appserver Successfully."
                    emailext attachLog: true,
                    compressLog: true,
                    to: "devops@reward360.co, tamil.selvan@reward360.co, joseph.ugin@reward360.co, sumit.kumar@reward360.co",
                    subject: "${env.JOB_NAME} - Build # ${env.BUILD_NUMBER} - ${currentBuild.currentResult}!",
                    body: '''${SCRIPT, template="groovy_html.template"}'''
                }
                failure {
                    echo "AngularUI4.0 Module Is Not Deployed on UAT Appserver."
                    emailext attachLog: true,
                    compressLog: true,
                    to: "devops@reward360.co, tamil.selvan@reward360.co, joseph.ugin@reward360.co, sumit.kumar@reward360.co",
                    subject: "${env.JOB_NAME} - Build # ${env.BUILD_NUMBER} Deployment Failed- ${currentBuild.currentResult}!",
                    body: '''${SCRIPT, template="groovy_fail_html.template"}'''
                }
            }
        }*/
    }
}
