# Connecting Expo with Cursor IDE

## ✅ Yes, Cursor Works Perfectly with Expo!

Cursor is based on VS Code and fully supports Expo/React Native development. Here's how they work together:

## 🎯 How Cursor + Expo Work Together

### 1. **Code Editing in Cursor**
- ✅ Full TypeScript/JavaScript support
- ✅ IntelliSense and autocomplete
- ✅ AI-powered code assistance (Cursor's AI features)
- ✅ Syntax highlighting
- ✅ Error detection
- ✅ Git integration (already connected to GitHub)

### 2. **Terminal Integration**
- Use Cursor's integrated terminal to run Expo commands
- Run `npx expo start` directly in Cursor
- View logs and errors in the terminal

### 3. **Development Workflow**

```
Cursor (Code Editor)
    ↓
Terminal: npx expo start
    ↓
Expo Dev Server
    ↓
Expo Go App (iPhone) or iOS Simulator
```

## 🚀 Recommended Cursor Extensions for Expo

While Cursor has built-in features, you can enhance it with extensions:

### Essential Extensions (Optional)
1. **ES7+ React/Redux/React-Native snippets** - Code snippets
2. **React Native Tools** - Debugging support
3. **TypeScript and JavaScript Language Features** - Already built-in
4. **Prettier** - Code formatting (optional)

### How to Install Extensions in Cursor
1. Press `Cmd+Shift+X` (or View → Extensions)
2. Search for the extension name
3. Click Install

## 💻 Development Setup in Cursor

### Step 1: Open Project in Cursor
```bash
# You're already here!
cd /Users/quintenharsveld/Downloads/AURA
```

### Step 2: Open Terminal in Cursor
- Press `` Ctrl+` `` (backtick) to open terminal
- Or: View → Terminal
- Or: Terminal → New Terminal

### Step 3: Run Expo Commands
In Cursor's terminal:
```bash
# Start Expo dev server
npx expo start

# Or with specific options
npx expo start --ios        # Open iOS simulator
npx expo start --clear     # Clear cache
```

### Step 4: Use Cursor's AI Features
- **Ask questions** about your Expo code
- **Get help** with React Native components
- **Debug errors** with AI assistance
- **Generate code** for screens and components

## 🔧 Cursor-Specific Features for Expo

### 1. **Multi-file Editing**
- Open multiple screens side-by-side
- Compare components easily
- Navigate between files quickly

### 2. **AI Code Completion**
- Cursor's AI understands React Native/Expo patterns
- Get suggestions as you type
- Ask for help with Expo-specific APIs

### 3. **Integrated Git**
- Already connected to GitHub
- Commit and push directly from Cursor
- View diffs and changes

### 4. **File Explorer**
- Navigate project structure easily
- Create new files/folders
- Search files quickly (`Cmd+P`)

## 📱 Testing Your App

### Option 1: Expo Go (Physical Device)
1. Run `npx expo start` in Cursor terminal
2. Scan QR code with Expo Go app on iPhone
3. Changes auto-reload in the app

### Option 2: iOS Simulator
1. Run `npx expo start --ios` in Cursor terminal
2. Simulator opens automatically
3. See changes instantly

### Option 3: Web (for quick testing)
1. Run `npx expo start --web` in Cursor terminal
2. Opens in browser
3. Good for UI testing (limited native features)

## 🎨 Recommended Cursor Settings for Expo

Create `.vscode/settings.json` in your project:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "files.exclude": {
    "**/.expo": true,
    "**/.expo-shared": true
  }
}
```

## 🔍 Debugging in Cursor

### Console Logging
- Use `console.log()` in your code
- View logs in Cursor's terminal where Expo is running
- Or use React Native Debugger

### Error Detection
- Cursor shows TypeScript errors in real-time
- Red squiggles for syntax errors
- Hover for error details

## 📝 Workflow Example

1. **Edit code** in Cursor (e.g., `App.tsx`)
2. **Save file** (`Cmd+S`)
3. **Expo auto-reloads** (if dev server is running)
4. **See changes** in Expo Go or simulator
5. **Commit changes** in Cursor's Git panel
6. **Push to GitHub** when ready

## 🎯 Quick Commands in Cursor

| Action | Shortcut |
|--------|----------|
| Open Terminal | `` Ctrl+` `` |
| Open Command Palette | `Cmd+Shift+P` |
| Quick File Open | `Cmd+P` |
| Search in Files | `Cmd+Shift+F` |
| Git Commit | `Cmd+Shift+G` (then click commit) |

## 💡 Tips for Expo + Cursor

1. **Keep Terminal Open**: Always have Expo dev server running in a terminal tab
2. **Use AI**: Ask Cursor's AI for help with Expo-specific questions
3. **Watch for Errors**: Cursor highlights errors before you run the app
4. **Git Integration**: Commit frequently - Cursor makes it easy
5. **Multi-cursor Editing**: Use `Cmd+D` to edit multiple instances

## 🚨 Troubleshooting

### Expo Server Not Starting
- Check Node.js is installed: `node --version`
- Clear cache: `npx expo start --clear`
- Check terminal for error messages

### Changes Not Reflecting
- Make sure Expo dev server is running
- Check if file was saved
- Try reloading: Shake device → Reload, or `r` in terminal

### TypeScript Errors
- Cursor shows these automatically
- Hover over red squiggles for details
- Fix errors before running (optional, but recommended)

## 🎉 You're All Set!

Cursor and Expo work seamlessly together. You can:
- ✅ Write code in Cursor
- ✅ Run Expo in Cursor's terminal
- ✅ Use AI assistance for development
- ✅ Test on device/simulator
- ✅ Commit and push to GitHub

**No additional setup needed** - Cursor is ready to work with Expo right out of the box!

---

**Next Step:** Once Node.js is installed, we'll initialize the Expo project and you can start coding in Cursor immediately!

