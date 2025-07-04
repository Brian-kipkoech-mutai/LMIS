#!/bin/bash
set -e

# ====== AUTO-INCREMENT VERSION ======
VERSION_FILE="VERSION"
CURRENT_VERSION=$(cat $VERSION_FILE)         # e.g. v1.0.5
BASE="${CURRENT_VERSION%.*}"                 # v1.0
PATCH="${CURRENT_VERSION##*.}"               # 5
NEW_PATCH=$((PATCH + 1))                     # 6
NEW_VERSION="${BASE}.${NEW_PATCH}"          # v1.0.6

# Save back to version file
echo "$NEW_VERSION" > $VERSION_FILE

# ====== CONFIGURATION ======
IMAGE_NAME="brianmutai/lmis-backend"
IMAGE_TAG="$IMAGE_NAME:$NEW_VERSION"
IMAGE_LATEST="$IMAGE_NAME:latest"
SERVER_USER="bmutai"
SERVER_HOST="41.220.118.182"
SERVER_PORT="2222"
SERVER_PASSWORD='lm1$_973g!'
REMOTE_DIR="/home/bmutai/lms-infrastructure"

# ====== BUILD & PUSH ======
echo "🔨 Building Docker image: $IMAGE_LATEST and $IMAGE_TAG ..."
docker build -t $IMAGE_LATEST -t $IMAGE_TAG .

echo "📦 Pushing both latest and versioned images to Docker Hub ..."
docker push $IMAGE_LATEST
docker push $IMAGE_TAG

# ====== DEPLOY TO SERVER ======
echo "🔧 Connecting to server and deploying ..."

sshpass -p "$SERVER_PASSWORD" ssh -t -p $SERVER_PORT -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST <<EOF
  set -e
  echo "📥 Pulling images ..."
  docker pull $IMAGE_LATEST
  docker pull $IMAGE_TAG

  echo "🔁 Restarting backend container with latest image ..."
  cd $REMOTE_DIR
  docker compose up -d postgres
  docker compose up -d --pull always --force-recreate backend

  echo "🧼 Cleaning up unused images ..."
  docker image prune -f

  echo "✅ Server deployment complete!"
EOF

echo "🚀 Deployment of $NEW_VERSION successful!"
