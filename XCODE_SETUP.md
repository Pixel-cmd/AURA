# Xcode Setup Instructions

## ✅ Xcode is Installed!

To complete the setup, you need to switch the command line tools to use the full Xcode installation (instead of just the standalone tools).

## Quick Setup (One Command)

Open **Cursor's terminal** and run:

```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

**You'll be prompted for your Mac password** - enter it and press Enter.

## Verify It Worked

After running the command, verify with:

```bash
xcode-select -p
```

You should see: `/Applications/Xcode.app/Contents/Developer`

## Accept Xcode License (If Needed)

If you get a license error, run:

```bash
sudo xcodebuild -license accept
```

## Test iOS Simulator

Once configured, you can:

1. **Start Expo dev server:**
   ```bash
   npx expo start
   ```

2. **Open iOS Simulator:**
   - Press `i` in the Expo terminal, OR
   - Run: `open -a Simulator`

3. **Or use Expo Go on your iPhone:**
   - Scan the QR code that appears

## What This Does

This switches your development tools from the basic Command Line Tools to the full Xcode installation, which includes:
- ✅ iOS Simulator
- ✅ Full build tools
- ✅ All iOS development capabilities

---

**After running the `sudo xcode-select` command, let me know and I'll test everything!**

