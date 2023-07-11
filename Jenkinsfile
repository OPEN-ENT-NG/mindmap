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
          sh 'find ./src/main/resources -name "*.html" -type f -exec cp {} ./src/main/resources/view/ \\;'
          sh 'find ./src/main/resources -maxdepth 1 -type f -name "*.html" -delete'
          sh 'rm -rf ../frontend/dist'
          sh './build.sh clean build publish'
          sh 'find ./src/main/resources -mindepth 1 -type d -exec rm -rf {} +'
        }
      }
    }
  }
}