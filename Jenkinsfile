#!/usr/bin/env groovy

pipeline {
  agent any

  stages {
    stage('Frontend') {
      steps {
        dir('frontend') {
          sh './build.sh clean init build'
        }
      }
    }
    
    stage('Backend') {
      steps {
        dir('backend') {
          sh 'mkdir -p ./src/main/resources'
          sh 'cp -R ../frontend/dist/* ./src/main/resources/'
          sh 'mkdir -p ./src/main/resources/view'
          sh 'cp -R ./src/main/resources/*.html ./src/main/resources/view'
          sh './build.sh clean build publish'
          sh 'rm -rf ../frontend/dist'
          sh 'rm -rf ./src/main/resources'
        }
      }
    }
  }
}