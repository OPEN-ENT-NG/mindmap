#!/usr/bin/env groovy

pipeline {
  agent any
    stages {
      stage('Init') {
        steps {
          checkout scm
          sh 'cd frontend && ./build.sh clean init'
        }
      }
      stage('Build') {
        steps {
          checkout scm
          sh 'cd backend && ./build.sh clean build publish'
        }
      }
    }
}

