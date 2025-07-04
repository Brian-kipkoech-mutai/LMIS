#!/bin/bash

# ====== CONFIGURATION ======
IMAGE_NAME="brianmutai/lmis-backend:latest"
SERVER_USER="bmutai"
SERVER_HOST="41.220.118.182"
SERVER_PORT="2222"
# shellcheck disable=SC2016
SERVER_PASSWORD='lm1$_973g!'
REMOTE_DIR="/home/bmutai/lms-infrastructure"

# ====== BUILD LOCALLY ======
echo "🔨 Building Docker image: $IMAGE_NAME ..."
docker build -t $IMAGE_NAME .

# ====== PUSH TO DOCKER HUB ======
echo "📦 Pushing image to Docker Hub ..."
docker push $IMAGE_NAME

# ====== SSH AND DEPLOY ======
echo "🔧 Connecting to server and deploying ..."

sshpass -p "$SERVER_PASSWORD" ssh -t -p $SERVER_PORT -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST << EOF
  echo "📥 Pulling latest image ..."
  docker pull $IMAGE_NAME

  echo "🔁 Rebuilding and restarting containers with --force-recreate ..."
  cd $REMOTE_DIR
  docker compose down
  docker compose up -d --build --force-recreate backend
  docker compose up -d postgres

  echo "✅ Server deployment complete!"
EOF

echo "😎🛌💤🙏 Deployment done successfully."
