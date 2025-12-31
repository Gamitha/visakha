#!/bin/bash
# Setup script for Node.js backend

echo "🚀 Setting up Visakha Event Management - Node.js Backend"
echo ""

# Navigate to backend directory
cd "$(dirname "$0")/backend"

# Create .env from example if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
fi

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

echo ""
echo "✅ Backend setup complete!"
echo ""

# Setup root dependencies
cd ..
echo "📦 Installing frontend dependencies..."
npm install

echo ""
echo "📋 Next steps:"
echo "  1. Start Docker containers: docker-compose up -d db mailhog"
echo "  2. Push database schema: cd backend && npx prisma db push"
echo "  3. Seed database: cd backend && npm run db:seed"
echo "  4. Start Node.js backend: cd backend && npm run dev"
echo "  5. Start Vite dev server: npm run dev"
echo ""
