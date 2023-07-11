#!/bin/bash

# Options
NO_DOCKER=""
for i in "$@"
do
case $i in
  --no-docker*)
  NO_DOCKER="true"
  shift
  ;;
  *)
  ;;
esac
done

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <clean|init|localDep|build|install|watch>"
  echo "Example: $0 clean"
  echo "Example: $0 init"
  echo "Example: $0 localDep Use this option to update the ode-ts-client NPM dependency with a local version"
  echo "Example: $0 build"
  echo "Example: $0 install"
  echo "Example: $0 [--springboard=recette] watch"
  exit 1
fi

if [ -z ${USER_UID:+x} ]
then
  export USER_UID=1000
  export GROUP_GID=1000
fi

# options
SPRINGBOARD="recette"
for i in "$@"
do
case $i in
    -s=*|--springboard=*)
    SPRINGBOARD="${i#*=}"
    shift
    ;;
    *)
    ;;
esac
done

clean () {
  rm -rf node_modules 
  rm -rf dist 
  rm -rf build 
  rm -rf .pnpm-store
  rm -f package.json 
  rm -f pnpm-lock.yaml
}

doInit () {
  echo "[init] Get branch name from jenkins env..."
  BRANCH_NAME=`echo $GIT_BRANCH | sed -e "s|origin/||g"`
  if [ "$BRANCH_NAME" = "" ]; then
    echo "[init] Get branch name from git..."
    BRANCH_NAME=`git branch | sed -n -e "s/^\* \(.*\)/\1/p"`
  fi

  echo "[init] Generate package.json from package.json.template..."
  NPM_VERSION_SUFFIX=`date +"%Y%m%d%H%M"`
  cp package.json.template package.json
  sed -i "s/%branch%/${BRANCH_NAME}/" package.json
  sed -i "s/%generateVersion%/${NPM_VERSION_SUFFIX}/" package.json

  if [ "$1" == "Dev" ]
  then
    sed -i "s/%odeTsClientVersion%/link:..\/..\/ode-ts-client\//" package.json
  else
    sed -i "s/%odeTsClientVersion%/${BRANCH_NAME}/" package.json
  fi

  if [ "$NO_DOCKER" = "true" ] ; then
    pnpm install
  else
    docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "pnpm install"
  fi

}

init() {
  doInit
}

initDev() {
  doInit "Dev"
}

# Install local dependencies as tarball (installing as folder creates symlinks which won't resolve in the docker container)
localDep () {
  if [ -e $PWD/../ode-ts-client ]; then
    rm -rf ode-ts-client.tar ode-ts-client.tar.gz
    mkdir ode-ts-client.tar && mkdir ode-ts-client.tar/dist \
      && cp -R $PWD/../ode-ts-client/dist $PWD/../ode-ts-client/package.json ode-ts-client.tar
    tar cfzh ode-ts-client.tar.gz ode-ts-client.tar
    if [ "$NO_DOCKER" = "true" ] ; then
      pnpm install --no-save ode-ts-client.tar.gz
    else
      docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "pnpm install --no-save ode-ts-client.tar.gz"
    fi
    rm -rf ode-ts-client.tar ode-ts-client.tar.gz
  fi
}

build () {
  if [ "$NO_DOCKER" = "true" ] ; then
    pnpm build
  else
    docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "pnpm build"
  fi
  status=$?
  if [ $status != 0 ];
  then
    exit $status
  fi
}

publishNPM () {
  LOCAL_BRANCH=`echo $GIT_BRANCH | sed -e "s|origin/||g"`
  if [ "$NO_DOCKER" = "true" ] ; then
    pnpm publish --tag $LOCAL_BRANCH
  else
    docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "pnpm publish --tag $LOCAL_BRANCH"
  fi
}

publishMavenLocal (){
  mvn install:install-file \
    --batch-mode \
    -DgroupId=$MVN_MOD_GROUPID \
    -DartifactId=$MVN_MOD_NAME \
    -Dversion=$MVN_MOD_VERSION \
    -Dpackaging=tar.gz \
    -Dfile=${MVN_MOD_NAME}.tar.gz
}

for param in "$@"
do
  case $param in
    clean)
      clean
      ;;
    init)
      init
      ;;
    initDev)
      initDev
      ;;
    localDep)
      localDep
      ;;
    build)
      build
      ;;
    install)
      build && archive && publishMavenLocal && rm -rf build
      ;;
    watch)
      watch
      ;;
    archive)
      archive
      ;;
    publishNPM)
      publishNPM
      ;;
    *)
      echo "Invalid argument : $param"
  esac
  if [ ! $? -eq 0 ]; then
    exit 1
  fi
done