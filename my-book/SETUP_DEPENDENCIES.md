# 🔧 Setup Dependencies - Step by Step

This guide will help you install all required dependencies for your RAG Chatbot + Docusaurus project.

---

## ✅ Prerequisites

- Node.js v16+ installed ([download here](https://nodejs.org/))
- npm v7+ installed (comes with Node.js)

**Verify:**
```powershell
node --version
npm --version
```

---

## 🚀 Installation Steps

### Step 1: Navigate to Project Folder

```powershell
cd c:\Users\PC\Desktop\spec-kit-plus\my-book
```

### Step 2: Remove Old node_modules (if exists)

```powershell
# PowerShell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
rm package-lock.json -ErrorAction SilentlyContinue
```

### Step 3: Install Dependencies

```powershell
npm install --legacy-peer-deps
```

**This will:**
- Download all packages from npm registry
- Create `node_modules` folder (~500MB)
- Generate `package-lock.json`
- Takes 3-5 minutes depending on internet

**Expected Output:**
```
added 500+ packages in 4m
found 0 vulnerabilities
```

### Step 4: Verify Installation

```powershell
npm run build
```

If this completes without errors, everything is installed! ✅

---

## 🎯 What Gets Installed

| Package | Purpose |
|---------|---------|
| `@docusaurus/core` | Documentation framework |
| `@docusaurus/preset-classic` | Classic template |
| `react` | UI library |
| `express` | Web server for RAG API |
| `@xenova/transformers` | ML models for embeddings |
| `prism-react-renderer` | Code syntax highlighting |
| Others | Supporting libraries |

---

## ⚠️ Troubleshooting

### Error: "Cannot find module 'prism-react-renderer'"

**Solution:** You haven't run `npm install` yet
```powershell
npm install --legacy-peer-deps
```

### Error: "npm ERR! 404 Not Found"

**Solution:** Clear cache and retry
```powershell
npm cache clean --force
npm install --legacy-peer-deps
```

### Error: "ERESOLVE unable to resolve dependency tree"

**Solution:** Use legacy peer deps flag (already in command above)
```powershell
npm install --legacy-peer-deps
```

### Slow Download?

**Solution:** Use different registry
```powershell
npm install --legacy-peer-deps --registry https://registry.npmmirror.com
```

### Installation Stuck?

**Solution:** Cancel and try again
```powershell
# Press Ctrl+C to cancel
npm cache clean --force
npm install --legacy-peer-deps
```

---

## ✅ After Installation

Once installed, you can run:

### Start Development Server
```powershell
npm start
```
Opens at: http://localhost:3000

### Start RAG API Server (in another terminal)
```powershell
npm run rag:serve
```
API runs at: http://localhost:3001

### Build for Production
```powershell
npm run build
```

### Run All RAG Tasks
```powershell
npm run rag:all
```

---

## 📊 Installation Checklist

- [ ] Node.js v16+ installed
- [ ] In correct folder: `c:\Users\PC\Desktop\spec-kit-plus\my-book`
- [ ] Ran: `npm install --legacy-peer-deps`
- [ ] Installation completed without errors
- [ ] Can run: `npm start` (opens at localhost:3000)
- [ ] Can run: `npm run build` (no errors)

---

## 🆘 Still Having Issues?

1. **Delete node_modules completely:**
   ```powershell
   Remove-Item -Recurse -Force node_modules
   rm package-lock.json
   ```

2. **Clear npm cache:**
   ```powershell
   npm cache clean --force
   ```

3. **Install fresh:**
   ```powershell
   npm install --legacy-peer-deps
   ```

4. **If still failing, check Node version:**
   ```powershell
   node --version  # Should be v16 or higher
   npm --version   # Should be v7 or higher
   ```

---

## 📝 Notes

- Installation downloads ~500MB of packages
- Takes 3-5 minutes on typical internet
- Only needed once per project
- `node_modules` folder can be deleted and reinstalled anytime
- `package-lock.json` keeps versions consistent

---

**Next Steps After Installation:**

1. ✅ Run `npm start` to view documentation
2. ✅ Run `npm run rag:serve` in another terminal for API
3. ✅ Create A/B test: `node rag/create-experiment.js`
4. ✅ View your chatbot at http://localhost:3000

---

**Need Help?** Check `README.md` or `SETUP_GUIDE.md` for more information.
