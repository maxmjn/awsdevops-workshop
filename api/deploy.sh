#!/usr/bin/env bash

# >> CHANGE THESE << to match the names you're using
# Set up our 3 main pieces
TASK_DEFINITION="awsdevops-api"
SERVICE="api-service"
CLUSTER="awsdevops-cluster"

set -e

echo "Building image ..."

# $IMAGE is available through our command in the deploy job.  It's sourced via $BASH_ENV which is a CircleCI var.
# $CIRCLE_SHA1 is also a CircleCI var for the SHA of this build.  Useful for unique tagging.
# build the image using the string we made in the `deploy` job and also tag it with our SHA
# also set this image to the `latest` tag as well
docker build -t $IMAGE:$CIRCLE_SHA1 -t $IMAGE:latest .

eval $(aws ecr get-login --no-include-email --region $AWS_DEFAULT_REGION)

docker push $IMAGE:latest
docker push $IMAGE:$CIRCLE_SHA1

echo "Updating service ..."

# Get current task definition as base of the update
# this gives us a perfect template to start from
aws ecs describe-task-definition --task-definition $TASK_DEFINITION >> base.json

# Exit if the base.json file fails to populate
if [ ! -f ./base.json ]; then
  echo "base.json not found!"
  exit 1
fi

# Create updated task file at file://update-task.json that we'll make shortly
node ./create-updated-task.js

# Exit if the updated file fails to populate
if [ ! -f ./updated-task.json ]; then
  echo "updated-task.json not found!"
  exit 1
fi

# Register our new task definition
aws ecs register-task-definition --cli-input-json file://updated-task.json

# update our service to use our new task definition
aws ecs update-service --cluster $CLUSTER --service $SERVICE --task-definition $TASK_DEFINITION

# remove temp files

rm ./base.json
rm ./updated-task.json
