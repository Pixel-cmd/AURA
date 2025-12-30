#!/bin/bash

# Automated Expo Setup - Run this after Node.js is installed
# This will be executed automatically once Node.js is available

set -e

echo "🚀 Starting Automated Expo Setup..."
echo ""

# Navigate to project directory
cd "$(dirname "$0")"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    echo "See QUICK_START.md for instructions"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ npm found: $(npm --version)"
echo ""

# Initialize Expo if not already done
if [ ! -f "package.json" ] || [ ! -f "app.json" ]; then
    echo "📦 Initializing Expo project..."
    npx create-expo-app@latest . --template blank-typescript --yes
    echo "✅ Expo project initialized"
else
    echo "✅ Expo project already exists"
fi

# Install core dependencies
echo ""
echo "📦 Installing core dependencies..."
npm install

# Install navigation
echo ""
echo "📦 Installing navigation..."
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context

# Install location
echo ""
echo "📦 Installing location services..."
npx expo install expo-location expo-task-manager

# Install authentication
echo ""
echo "📦 Installing authentication..."
npx expo install expo-auth-session expo-crypto expo-web-browser

# Install notifications
echo ""
echo "📦 Installing notifications..."
npx expo install expo-notifications expo-device

# Install gestures and animations
echo ""
echo "📦 Installing gestures and animations..."
npx expo install react-native-gesture-handler react-native-reanimated

# Install state management
echo ""
echo "📦 Installing state management..."
npm install zustand

# Install utilities
echo ""
echo "📦 Installing utilities..."
npm install @react-native-async-storage/async-storage

# Verify Git
echo ""
echo "🔍 Checking Git..."
if [ -d ".git" ]; then
    echo "✅ Git repository ready"
    git remote -v 2>/dev/null || echo "⚠️  No GitHub remote configured (we'll set this up)"
else
    echo "⚠️  Git not initialized"
fi

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📱 To start developing:"
echo "   npx expo start"
echo ""
echo "🎉 Ready to build your iOS app!"

