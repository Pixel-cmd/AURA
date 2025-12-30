# 🚀 Quick Homebrew Install

## Run This Command

Open **Cursor's terminal** and run:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## What Happens

1. You'll be asked for your **Mac password** (enter it)
2. Homebrew will download and install (takes 2-5 minutes)
3. You'll see installation progress
4. At the end, it will show commands to add Homebrew to your PATH

## After Installation

**Copy and run the commands** that Homebrew shows at the end (they look like):
```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
eval "$(/opt/homebrew/bin/brew shellenv)"
```

Or if you're on an Intel Mac:
```bash
echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zshrc
eval "$(/usr/local/bin/brew shellenv)"
```

## Verify It Worked

```bash
brew --version
```

You should see something like: `Homebrew 4.x.x`

## Then Run This

```bash
brew doctor
```

This checks that everything is working correctly.

---

**Once Homebrew is installed, let me know and I'll verify it's working!**

