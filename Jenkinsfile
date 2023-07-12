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
          sh 'cp -R ../frontend/dist/* ./src/main/resources/'
          sh 'mkdir -p ./src/main/resources/view'
          sh 'find ./src/main/resources -name "*.html" -type f -exec cp {} ./src/main/resources/view/ \\;'
          sh 'find ./src/main/resources/view -name "*.html" -type f -exec sed -i "s@/public@/mindmap/public@g" {} \\;'
          sh './build.sh clean build publish'
        }
      }
    }
  }
}