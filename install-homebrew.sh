#!/bin/bash

# Homebrew Installation Script for AURA Project
# Run this script in your terminal

set -e

echo "🍺 Installing Homebrew..."
echo "=========================="
echo ""
echo "This will install Homebrew, a package manager for macOS."
echo "You'll be prompted for your Mac password during installation."
echo ""

# Check if Homebrew is already installed
if command -v brew &> /dev/null; then
    echo "✅ Homebrew is already installed!"
    brew --version
    echo ""
    echo "Running 'brew doctor' to check for issues..."
    brew doctor
    exit 0
fi

# Install Homebrew
echo "📦 Starting Homebrew installation..."
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add Homebrew to PATH (for Apple Silicon Macs)
if [[ $(uname -m) == 'arm64' ]]; then
    echo ""
    echo "📝 Adding Homebrew to PATH for Apple Silicon Mac..."
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
    eval "$(/opt/homebrew/bin/brew shellenv)"
else
    echo ""
    echo "📝 Adding Homebrew to PATH for Intel Mac..."
    echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zshrc
    eval "$(/usr/local/bin/brew shellenv)"
fi

# Verify installation
echo ""
echo "🔍 Verifying installation..."
if command -v brew &> /dev/null; then
    echo "✅ Homebrew installed successfully!"
    brew --version
    echo ""
    echo "🏥 Running 'brew doctor' to check for issues..."
    brew doctor
    echo ""
    echo "✅ Homebrew is ready to use!"
else
    echo "❌ Installation may have failed. Please restart your terminal and try again."
    exit 1
fi

echo ""
echo "🎉 Done! You can now use Homebrew to install packages."
echo ""
echo "Example commands:"
echo "  brew install node    # Install Node.js"
echo "  brew install git     # Install Git"
echo "  brew install cocoapods  # Install CocoaPods"

