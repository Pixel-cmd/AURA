#!/bin/bash

# AURA iOS App - Complete Setup Script
# This script installs everything needed for Expo iOS development

set -e

echo "🚀 AURA iOS App - Complete Setup"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Homebrew...${NC}"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add Homebrew to PATH for Apple Silicon Macs
    if [[ $(uname -m) == 'arm64' ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
        eval "$(/opt/homebrew/bin/brew shellenv)"
    else
        echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zshrc
        eval "$(/usr/local/bin/brew shellenv)"
    fi
else
    echo -e "${GREEN}✅ Homebrew already installed${NC}"
    brew update
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Node.js (LTS)...${NC}"
    brew install node@20
    brew link node@20
else
    echo -e "${GREEN}✅ Node.js already installed${NC}"
    node --version
    npm --version
fi

# Verify Node.js installation
echo ""
echo -e "${BLUE}📋 Verifying installations...${NC}"
node --version
npm --version

# Navigate to project directory
cd "$(dirname "$0")"
echo ""
echo -e "${BLUE}📁 Project directory: $(pwd)${NC}"

# Initialize Expo project if not already done
if [ ! -f "package.json" ] || [ ! -f "app.json" ]; then
    echo ""
    echo -e "${YELLOW}📦 Initializing Expo project...${NC}"
    npx create-expo-app@latest . --template blank-typescript --yes
else
    echo -e "${GREEN}✅ Expo project already initialized${NC}"
fi

# Install core dependencies
echo ""
echo -e "${YELLOW}📦 Installing core dependencies...${NC}"
npm install

# Install navigation
echo ""
echo -e "${YELLOW}📦 Installing navigation libraries...${NC}"
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context

# Install location services
echo ""
echo -e "${YELLOW}📦 Installing location services...${NC}"
npx expo install expo-location expo-task-manager

# Install authentication
echo ""
echo -e "${YELLOW}📦 Installing authentication libraries...${NC}"
npx expo install expo-auth-session expo-crypto expo-web-browser

# Install notifications
echo ""
echo -e "${YELLOW}📦 Installing notification libraries...${NC}"
npx expo install expo-notifications expo-device

# Install gesture and animation libraries
echo ""
echo -e "${YELLOW}📦 Installing gesture and animation libraries...${NC}"
npx expo install react-native-gesture-handler react-native-reanimated

# Install state management (Zustand - lightweight and easy)
echo ""
echo -e "${YELLOW}📦 Installing state management...${NC}"
npm install zustand

# Install additional utilities
echo ""
echo -e "${YELLOW}📦 Installing utility libraries...${NC}"
npm install @react-native-async-storage/async-storage

# Verify Git setup
echo ""
echo -e "${BLUE}🔍 Checking Git configuration...${NC}"
if [ -d ".git" ]; then
    echo -e "${GREEN}✅ Git repository initialized${NC}"
    git remote -v || echo "No remote configured"
else
    echo -e "${YELLOW}⚠️  Git not initialized, but that's okay${NC}"
fi

echo ""
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo "📱 Next steps:"
echo "1. Run: npx expo start"
echo "2. Press 'i' for iOS simulator or scan QR code with Expo Go app"
echo "3. Start coding in Cursor!"
echo ""
echo "🎉 You're ready to build!"

