#!/usr/bin/env groovy

pipeline {
  agent any
    stages {
      stage('Init frontend') {
        steps {
          checkout scm
          sh 'cd frontend && ./build.sh clean init'
        }
      }
      stage('Build frontend') {
        steps {
          sh "cd frontend && ./build.sh build"
        }
      }
      stage('Clean backend') {
        steps {
          sh 'cd backend && ./build.sh clean'
        }
      }
      stage('Build backend') {
        steps {
          sh 'cd backend && ./build.sh build'
        }
      }
      stage('Publish') {
        steps {
          sh 'cd backend && ./build.sh publish'
        }
      }
    }
}

