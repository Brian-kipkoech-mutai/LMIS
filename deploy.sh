#!/bin/bash
set -e # Stop the script on any error

# ====== CONFIGURATION ======
VERSION="v1.0.5" # ⬅️ Change this per release
IMAGE_NAME="brianmutai/lmis-backend"
IMAGE_TAG="$IMAGE_NAME:$VERSION"
IMAGE_LATEST="$IMAGE_NAME:latest"
SERVER_USER="bmutai"
SERVER_HOST="41.220.118.182"
SERVER_PORT="2222"
# shellcheck disable=SC2016
SERVER_PASSWORD='lm1$_973g!' # switching to SSH key auth in the future is recommended
REMOTE_DIR="/home/bmutai/lms-infrastructure"

# ====== BUILD LOCALLY ======
echo "🔨 Building Docker image: $IMAGE_LATEST and $IMAGE_TAG ..."  
docker build -t $IMAGE_LATEST -t $IMAGE_TAG .

# ====== PUSH TO DOCKER HUB ======
echo "📦 Pushing both latest and versioned images to Docker Hub ..."
docker push $IMAGE_LATEST
docker push $IMAGE_TAG

# ====== SSH AND DEPLOY ======
echo "🔧 Connecting to server and deploying ..."

sshpass -p "$SERVER_PASSWORD" ssh -t -p $SERVER_PORT -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST <<EOF
  set -e
  echo "📥 Pulling latest and versioned images ..."
  docker pull $IMAGE_LATEST
  docker pull $IMAGE_TAG

  echo "🔁 Restarting backend container with latest image using --pull always ..."
  cd $REMOTE_DIR

  # Ensure postgres is up first
  docker compose up -d postgres

  # Restart backend with latest image and force recreate
  docker compose up -d --pull always --force-recreate backend

  echo "🧼 Cleaning up unused images ..."
  docker image prune -f

  echo "✅ Server deployment complete!"
EOF

echo "😎🛠️🚀 Deployment done successfully."
