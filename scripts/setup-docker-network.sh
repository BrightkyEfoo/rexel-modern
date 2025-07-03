#!/bin/bash

# Script to setup shared Docker network for Rexel Modern
# This script creates the shared network used by both frontend and backend

set -e

NETWORK_NAME="rexel-net"

echo "🔗 Setting up Docker network for Rexel Modern..."

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if network already exists
if docker network ls | grep -q "$NETWORK_NAME"; then
    echo "✅ Network '$NETWORK_NAME' already exists."
else
    echo "🆕 Creating network '$NETWORK_NAME'..."
    docker network create "$NETWORK_NAME"
    echo "✅ Network '$NETWORK_NAME' created successfully."
fi

# Show network details
echo ""
echo "📋 Network details:"
docker network inspect "$NETWORK_NAME" --format "{{.Name}}: {{.Id}}"

echo ""
echo "✅ Docker network setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Deploy backend: cd rexel-modern-backend && docker-compose -f docker-compose.prod.yml up -d"
echo "   2. Deploy frontend: cd rexel-modern && docker-compose -f docker-compose.prod.yml up -d"
echo ""
echo "🌐 Your apps will be available at:"
echo "   Production:"
echo "   - Frontend: https://kesimarket.com"
echo "   - API: https://api.kesimarket.com"
echo ""
echo "   Staging:"
echo "   - Frontend: https://staging.kesimarket.com"
echo "   - API: https://staging-api.kesimarket.com" 