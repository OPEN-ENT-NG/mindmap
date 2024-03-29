#!/usr/bin/env groovy

pipeline {
  agent any

  stages {
    stage("Initialization") {
      steps {
        script {
          def version = sh(returnStdout: true, script: 'docker compose -f backend/docker-compose.yml run --rm maven mvn $MVN_OPTS help:evaluate -Dexpression=project.version -q -DforceStdout')
          buildName "${env.GIT_BRANCH.replace("origin/", "")}@${version}"
        }
      }
    }

    stage('Frontend') {
      steps {
        dir('frontend') {
          sh 'GIT_BRANCH=develop ./build.sh clean init build'
        }
      }
    }

    stage('Backend') {
      steps {
        dir('backend') {
          sh 'mkdir -p ./src/main/resources/public/ || TRUE'
          sh 'rm -rf ./src/main/resources/public/*.js'
          sh 'rm -rf ./src/main/resources/public/*.css'
          sh 'cp -R ../frontend/old/* ./src/main/resources/public/'
          sh 'cp -R ../frontend/old/*.html ./src/main/resources/'
          sh 'cp -R ../frontend/dist/* ./src/main/resources/'
          sh 'mkdir -p ./src/main/resources/view'
          sh 'rm -rf ./src/main/resources/view/notify'
          sh 'mv ./src/main/resources/*.html ./src/main/resources/view'
          sh 'cp -R ./src/main/resources/notify ./src/main/resources/view/notify'
          sh './build.sh init clean install publish'
          sh 'rm -rf ../frontend/dist'
        }
      }
    }
  }

  post {
    cleanup {
      sh 'cd backend && docker-compose down && cd ../frontend && docker-compose down'
    }
  }
}