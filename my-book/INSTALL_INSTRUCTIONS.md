# 🔧 Complete Installation Instructions

The `prism-react-renderer` error is resolved by installing npm dependencies. Here are the exact steps:

---

## ✅ Step-by-Step Installation

### 1. Open PowerShell as Administrator

- Click Windows Start
- Type: `powershell`
- Right-click → "Run as Administrator"
- Click "Yes"

### 2. Navigate to Project

```powershell
cd c:\Users\PC\Desktop\spec-kit-plus\my-book
```

### 3. Clean Previous Installation (if needed)

```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue  
npm cache clean --force
```

### 4. Install Dependencies

```powershell
npm install --legacy-peer-deps --force
```

**This will:**
- Download ~500MB of packages
- Take 5-10 minutes
- Create `node_modules` folder with all dependencies

**You should see:**
```
added XXX packages in Xm
```

### 5. Verify Installation

```powershell
npm run build
```

If you see no errors, installation is complete! ✅

---

## 🚀 After Installation Works

### Start Development Server

```powershell
npm start
```

Opens automatically at: **http://localhost:3000**

### In Another PowerShell Window - Start RAG Server

```powershell
cd c:\Users\PC\Desktop\spec-kit-plus\my-book
npm run rag:serve
```

API runs at: **http://localhost:3001**

---

## ⚠️ If Installation Fails

### Try Option A: Force Installation

```powershell
npm install --legacy-peer-deps --force --timeout=60000
```

### Try Option B: Use Different Registry

```powershell
npm install --legacy-peer-deps --registry https://registry.npmmirror.com
```

### Try Option C: Nuclear Option (Delete Everything)

```powershell
# Remove everything
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
Remove-Item package.json

# Reinstall
npm init -y
npm install @docusaurus/core@2.4.3 @docusaurus/preset-classic@2.4.3 react@17.0.2 react-dom@17.0.2 express@4.18.2 cors@2.8.5 @xenova/transformers@2.6.0 --legacy-peer-deps
npm install --save-dev prism-react-renderer@2.1.0 clsx@1.2.1 @mdx-js/react@2.3.0 prismjs@1.29.0 --legacy-peer-deps
```

---

## 📋 Checklist

After installation, verify these files exist:

```powershell
cd c:\Users\PC\Desktop\spec-kit-plus\my-book
dir package-lock.json
dir node_modules
dir node_modules\.bin\docusaurus.cmd
```

All three should exist.

---

## 🎯 Quick Test

```powershell
# Test that it works
npm run build
```

If build completes without errors, you're done! ✅

---

##Errors You Might See (and Solutions)

### "ERESOLVE unable to resolve dependency tree"

**Fix:**
```powershell
npm install --legacy-peer-deps --force
```

### "npm ERR! 404 Not Found"

**Fix:**
```powershell
npm cache clean --force
npm install --legacy-peer-deps
```

### "Unsupported engine node"

**Fix:** Ignore it (it's just a warning), npm install will continue

### "'docusaurus' is not recognized"

**Fix:** npm install didn't complete properly, try again:
```powershell
Remove-Item -Recurse -Force node_modules
npm install --legacy-peer-deps --force
```

---

## 💡 What Each Command Does

| Command | Purpose |
|---------|---------|
| `npm install` | Download all dependencies |
| `--legacy-peer-deps` | Allow older package versions |
| `--force` | Skip warnings and force install |
| `npm run build` | Test that installation worked |
| `npm start` | Start development server |

---

## ⏱️ Timeline

- **npm install:** 5-10 minutes (first time)
- **npm start:** Starts in 10-20 seconds
- **npm build:** 1-2 minutes

---

## 🔗 After Everything Works

1. ✅ `npm start` → http://localhost:3000
2. ✅ `npm run rag:serve` → http://localhost:3001
3. ✅ Chat with your AI chatbot!

---

**Still stuck?** Try Step 3 completely, then Step 4 again.
