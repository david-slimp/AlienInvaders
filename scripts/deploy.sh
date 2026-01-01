#!/bin/bash
set -e  # Exit on error

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo "Error: .env file not found. Please create it from .env.example"
    exit 1
fi

# Build the production version
echo "🔨 Building production version..."
npm run build

# Ensure meta.txt is deployed alongside index.html
cp meta.txt dist/meta.txt

# Deploy using rsync
echo "🚀 Deploying files to production server..."
rsync -avz --progress --delete dist/ ${DEPLOY_USER}@${DEPLOY_SERVER}:${DEPLOY_PATH}

echo "✅ Deployment complete!"
echo "🌐 Visit: https://rock808.com/games/AlienInvaders/"
