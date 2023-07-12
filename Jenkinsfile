#!/usr/bin/env groovy

pipeline {
  agent any

  stages {
    /* stage('Checkout') {
      steps {
        checkout scm
      }
    } */

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
          sh './build.sh clean build publish'
        }
      }
    }
  }
}

// pipeline {
//   agent any
//     stages {
//       stage('Init frontend') {
//         steps {
//           checkout scm
//           sh 'cd frontend && ./build.sh clean init'
//         }
//       }
//       stage('Build frontend') {
//         steps {
//           sh "cd frontend && ./build.sh build"
//         }
//       }
//       stage('Clean backend') {
//         steps {
//           sh 'cd backend && ./build.sh clean'
//         }
//       }
//       stage('Build backend') {
//         steps {
//           sh 'cd backend && ./build.sh build'
//         }
//       }
//       stage('Publish') {
//         steps {
//           sh 'cd backend && ./build.sh publish'
//         }
//       }
//     }
// }

