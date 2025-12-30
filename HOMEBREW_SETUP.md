# 🍺 Homebrew Installation Guide

## Quick Install

Homebrew is **not currently installed**. To install it, run this command in Cursor's terminal:

```bash
./install-homebrew.sh
```

Or install manually:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## What You'll Need

- Your **Mac password** (for sudo access)
- A few minutes for installation

## After Installation

1. **Restart your terminal** (or run `source ~/.zshrc`)
2. **Verify it works:**
   ```bash
   brew --version
   ```

## Why Homebrew?

Homebrew makes it easy to install:
- Development tools
- CocoaPods (for iOS development)
- Other packages you might need

## Verify Installation

After installing, run:

```bash
brew doctor
```

This checks for any issues with your Homebrew installation.

## Common Commands

```bash
brew install <package>    # Install a package
brew update               # Update Homebrew
brew upgrade              # Upgrade installed packages
brew doctor               # Check for issues
```

---

**Status:** ⏳ Waiting for Homebrew installation

**Next Step:** Run `./install-homebrew.sh` in your terminal!

