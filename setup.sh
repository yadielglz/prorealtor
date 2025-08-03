#!/bin/bash

echo "🚀 Setting up Realtor Platform with Firebase..."

# Clean any existing node_modules and package-lock
echo "🧹 Cleaning existing dependencies..."
rm -rf node_modules
rm -f package-lock.json

# Install dependencies with legacy peer deps to resolve conflicts
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# If that fails, try with force flag
if [ $? -ne 0 ]; then
    echo "⚠️  Installation failed, trying with --force flag..."
    npm install --force
fi

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  Warning: .env.local file not found!"
    echo "Please make sure you have the Firebase configuration in .env.local"
else
    echo "✅ Environment configuration found"
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo ""
echo "1. Make sure your .env.local has all required Firebase credentials"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:3000/firebase-test to test Firebase configuration"
echo ""
echo "If you encounter any issues, try:"
echo "- npm install --force"
echo "- npm run dev"
echo ""