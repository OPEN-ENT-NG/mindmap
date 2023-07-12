#!/usr/bin/env groovy

pipeline {
  agent any
    stages {
      stage('Init frontend') {
        steps {
          dir('frontend')
          checkout scm
          sh './build.sh clean init'
        }
      }
      stage('Build frontend') {
        steps {
          dir('frontend')
          sh "./build.sh build"
        }
      }
      stage('Clean backend') {
        steps {
          dir('backend')
          sh './build.sh clean'
        }
      }
      stage('Build backend') {
        steps {
          dir('backend')
          sh './build.sh build'
        }
      }
      stage('Publish') {
        steps {
          dir('backend')
          sh './build.sh publish'
        }
      }
    }
}

