#!/usr/bin/env bash

set -e

SERVICE_FOLDERS=("cache" "queue" "auth" "core" "extra")

# docker tag for local testing
TAG="local-test"

PARENT_DIR=".."
TMP_DIR="./tmp_images"
mkdir -p "$TMP_DIR"

echo "===================================================="
echo "🚀 Starting MicroK8s Build & Import Pipeline"
echo "===================================================="

for SERVICE in "${SERVICE_FOLDERS[@]}"; do
    SERVICE_DIR="$PARENT_DIR/$SERVICE"
    if [ ! -d "$SERVICE_DIR" ]; then
        echo "❌ Error: Directory '$SERVICE_DIR' not found. Skipping..."
        continue
    fi

    echo ""
    echo "📂 Processing service: $SERVICE from ($SERVICE_DIR)"
    echo "----------------------------------------------------"
    
    IMAGE_NAME="pdfshare/$SERVICE:$TAG"

    if [ -n "$(docker images -q "$IMAGE_NAME" 2> /dev/null)" ]; then
        echo "✨ Image '$IMAGE_NAME' already exists locally! Skipping build phase..."
    else
        echo "🛠️  Image '$IMAGE_NAME' not found. Building from source folder..."
        
        # Navigate into folder and build
        cd "$SERVICE_DIR"
        docker build -t "$IMAGE_NAME" .
        cd ..
    fi

    TAR_FILE="$TMP_DIR/$SERVICE.tar"

    echo "📦 Saving image to archive: $TAR_FILE..."
    if ! docker save -o "$TAR_FILE" "$IMAGE_NAME"; then
        echo "❌ Error: Failed to export docker image '$IMAGE_NAME' to tar."
        exit 1
    fi

    if [ ! -f "$TAR_FILE" ] || [ ! -s "$TAR_FILE" ]; then
        echo "❌ Error: Target file '$TAR_FILE' was not created or is empty!"
        exit 1
    fi

    echo "📥 Importing archive into MicroK8s container registry..."
    sudo microk8s ctr images import "$TAR_FILE"

    echo "✅ Successfully processed $SERVICE!"
done

echo ""
echo "===================================================="
echo "🧹 Cleaning up temporary workspace files..."
rm -rf "$TMP_DIR"

sudo microk8s ctr images list | grep "pdfshare/"