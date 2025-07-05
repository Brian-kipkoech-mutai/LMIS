#!/bin/bash
set -e

# ====== VERSIONING ======
VERSION_FILE="VERSION"

# If version file doesn't exist, initialize it
if [ ! -f "$VERSION_FILE" ]; then
  echo "v1.0.0" > "$VERSION_FILE"
fi

CURRENT_VERSION=$(cat "$VERSION_FILE")
BASE="${CURRENT_VERSION%.*}"
PATCH="${CURRENT_VERSION##*.}"
NEW_PATCH=$((PATCH + 1))
NEW_VERSION="${BASE}.${NEW_PATCH}"
echo "$NEW_VERSION" > "$VERSION_FILE"

# ====== CONFIGURATION ======
IMAGE_NAME="brianmutai/lmis-backend"
IMAGE_TAG="$IMAGE_NAME:$NEW_VERSION"
IMAGE_LATEST="$IMAGE_NAME:latest"
SERVER_USER="bmutai"
SERVER_HOST="41.220.118.182"
SERVER_PORT="2222"
REMOTE_DIR="/home/bmutai/lms-infrastructure"

# ====== BUILD & PUSH ======
echo -e "\033[1;34m🔨 Building Docker image: $IMAGE_LATEST and $IMAGE_TAG ...\033[0m"
docker build -t "$IMAGE_LATEST" -t "$IMAGE_TAG" .

echo -e "\033[1;34m📦 Pushing both latest and versioned images to Docker Hub ...\033[0m"
docker push "$IMAGE_LATEST"
docker push "$IMAGE_TAG"

# ====== DEPLOY TO SERVER ======
echo -e "\033[1;33m🔧 Connecting to server and deploying ...\033[0m"
ssh -t -p "$SERVER_PORT" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_HOST" <<EOF
  set -e

  echo -e "\033[1;34m📥 Pulling images ...\033[0m"
  docker pull "$IMAGE_LATEST"
  docker pull "$IMAGE_TAG"

  echo -e "\033[1;33m🔁 Restarting backend container with latest image ...\033[0m"
  cd "$REMOTE_DIR"
  docker compose up -d postgres
  docker compose up -d --pull always --force-recreate backend

  echo -e "\033[1;34m🧼 Cleaning up unused images ...\033[0m"
  docker image prune -f

  echo -e "\033[1;32m✅ Server deployment complete!\033[0m"
EOF

echo -e "\033[1;32m🚀 Deployment of $NEW_VERSION successful!\033[0m"
