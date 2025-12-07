# 🚀 RAG Chatbot Setup Guide

Complete setup instructions for the Physical AI textbook with integrated AI chatbot.

## ⏱️ Time Required

- **First time**: 5-10 minutes (installing, downloading models)
- **Subsequent runs**: 1-2 minutes

---

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ **Node.js 16+** → [Download](https://nodejs.org/)
- ✅ **npm 7+** (comes with Node.js)
- ✅ **7 GB free disk space** (for node_modules and ML models)
- ✅ **Terminal/Command Prompt** access

### Verify Installation

```bash
node --version    # Should show v16+ (e.g., v18.12.0)
npm --version     # Should show 7+ (e.g., 8.19.2)
```

---

## 🎯 Quick Setup (5 minutes)

### For Windows Users (Easiest)

**Option 1: Click Setup Script**
```
Double-click: setup.bat
```

**Option 2: Manual PowerShell**
```powershell
# Open PowerShell in my-book directory
npm install
npm run rag:ingest
npm run rag:embed
npm run rag:serve
```

### For macOS/Linux Users

```bash
# Option 1: Run setup script
bash setup.sh

# Option 2: Manual steps
npm install
npm run rag:ingest
npm run rag:embed
npm run rag:serve
```

---

## 📝 Detailed Step-by-Step Setup

### Step 1: Navigate to Project

```bash
cd /path/to/my-book
```

Replace `/path/to/my-book` with actual path, e.g.:
- Windows: `C:\Users\YourName\Desktop\spec-kit-plus\my-book`
- Mac/Linux: `/Users/yourname/Desktop/spec-kit-plus/my-book`

### Step 2: Install Dependencies (2-3 minutes)

```bash
npm install
```

You'll see:
```
added 500+ packages in 2m45s
```

**What's installing:**
- Docusaurus (documentation framework)
- Express.js (API server)
- Transformers.js (ML models for embeddings)
- React (UI components)

### Step 3: Process Documents (30 seconds)

```bash
npm run rag:ingest
```

You'll see:
```
🔍 Starting document ingestion...
📄 Found 37 markdown files
✅ introduction/01-welcome.md → 5 chunks
✅ physical-ai/01-what-is-physical-ai.md → 4 chunks
... (more chapters)
✨ Ingestion complete!
📊 Total chunks: 156
💾 Saved to: rag/chunks.json
```

This creates: `rag/chunks.json` (~1-2 MB)

### Step 4: Generate Embeddings (2-3 minutes)

```bash
npm run rag:embed
```

**First run:** Downloads embedding model (~500 MB) - takes 1-2 minutes  
**Subsequent runs:** Much faster, uses cached model

You'll see:
```
🧠 Starting embedding generation...
📦 Loaded 156 chunks from rag/chunks.json
🔄 Loading embedding model (first time may take ~1min)...
✅ Model loaded
⏳ Processed 10/156 chunks...
⏳ Processed 20/156 chunks...
... (progress)
✨ Embedding complete!
💾 Vector store saved to: rag/store.json
📊 Dimension: 384
📦 Total vectors: 156
```

This creates: `rag/store.json` (~5-10 MB)

---

## 🚀 Starting the System (3 Terminals)

Open **3 separate terminal/command prompt windows** in the `my-book` directory:

### Terminal 1: RAG Server

```bash
npm run rag:serve
```

Expected output:
```
🚀 RAG Server running on http://localhost:3001
📝 POST /api/chat - ask questions
💚 GET /api/health - check server status

⏸️  Press Ctrl+C to stop
```

**Status:** The chatbot backend is ready!

### Terminal 2: Docusaurus Documentation

```bash
npm start
```

Expected output:
```
[INFO] Docusaurus 3.0.0 running at...
[INFO] ⓘ You can now view my-book in the browser at http://localhost:3000
[SUCCESS] Docusaurus server started successfully.
```

### Terminal 3: Optional - Monitor Logs

Keep open to watch request logs:
```bash
# In macOS/Linux
tail -f /var/log/npm.log

# Or just keep a terminal open to see any errors
```

---

## ✨ First Use

1. **Open browser**: http://localhost:3000
2. **Look for**: Floating chat button (bottom right, purple circle)
3. **Click**: The chat button (💬)
4. **Type**: Any question about the textbook
5. **Press**: Enter or click send button

### Example Questions to Try

- "What is Physical AI?"
- "How do I learn robotics?"
- "Explain prompt engineering"
- "What sensors do robots use?"
- "How does SLAM work?"

---

## 🛑 Stopping the System

To stop everything:

**Terminal 1 (RAG Server):** Press `Ctrl+C`  
**Terminal 2 (Docusaurus):** Press `Ctrl+C`  

Both will show:
```
^C
Terminated
```

---

## 🔄 Restarting

If you need to restart after closing:

```bash
# Terminal 1
npm run rag:serve

# Terminal 2 (new terminal)
npm start
```

No need to re-run ingest/embed - those are one-time setup.

---

## 📊 Verifying Installation

### Check RAG Server Health

```bash
# In any terminal
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "ok",
  "uptime": 42.5,
  "vectorStore": "ready"
}
```

### Check Docusaurus

Open http://localhost:3000 in browser. You should see:
- ✅ Full textbook navigation
- ✅ Search functionality
- ✅ Chat button (bottom right)

---

## 🐛 Troubleshooting

### Issue: "npm: command not found"

**Solution:** Node.js not installed
```bash
# Verify installation
node --version
npm --version

# If not found, download and install:
# https://nodejs.org/
```

### Issue: "EACCES: permission denied"

**Mac/Linux:** Add `sudo`
```bash
sudo npm install
```

**Windows:** Run as Administrator
1. Right-click Command Prompt
2. Select "Run as administrator"
3. Re-run command

### Issue: "Error: Cannot find module @xenova/transformers"

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Vector store not found"

You skipped the embedding step:
```bash
npm run rag:ingest
npm run rag:embed
```

### Issue: "Port 3001 already in use"

Another process is using the port:

**Windows (PowerShell):**
```powershell
Get-Process | Where-Object {$_.Id -eq (Get-NetTCPConnection -LocalPort 3001).OwningProcess}
Stop-Process -Id <PID> -Force
```

**Mac/Linux:**
```bash
lsof -i :3001
kill -9 <PID>
```

### Issue: "Chat button doesn't appear"

1. Clear browser cache: `Ctrl+Shift+Delete`
2. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Check console (F12) for errors
4. Verify RAG server is running: `curl http://localhost:3001/api/health`

### Issue: Chatbot says "Connection refused"

RAG server not running:
```bash
# In Terminal 1
npm run rag:serve

# Wait for "✅ RAG Server running"
```

### Issue: Very slow embedding generation

**First run is slow** (1-2 minutes) due to model download - normal!

**Subsequent runs are fast:**
- If embedding still slow: Check internet connection or system resources
- Close other heavy applications

### Issue: Out of memory error

Reduce chunk size in `rag/utils.js`:
```javascript
export function chunkText(text, chunkSize = 1500) {  // Changed from 2000
```

Then re-run:
```bash
npm run rag:ingest
npm run rag:embed
```

---

## 📁 What Gets Created

After setup, you'll see new files:

```
rag/
├── chunks.json      # ~1-2 MB: Processed documents
└── store.json       # ~5-10 MB: Vector embeddings

node_modules/       # ~800 MB: Dependencies
.docusaurus/        # ~50 MB: Build cache
build/              # ~20 MB: Production build (after npm run build)
```

**Total space used:** ~1 GB (mostly node_modules)

---

## 🔄 Update Vector Store

To add new chapters or update existing ones:

1. **Edit or add markdown** files in `/docs`
2. **Re-ingest and re-embed:**
   ```bash
   npm run rag:ingest
   npm run rag:embed
   ```
3. **Restart RAG server:**
   - Stop Terminal 1 (Ctrl+C)
   - Run `npm run rag:serve` again
4. **Refresh browser:** F5

---

## 🎯 Next Steps

After successful setup:

1. **Explore the textbook** - Browse all chapters
2. **Try the chatbot** - Ask questions about content
3. **Customize** - Edit styling, add content
4. **Share** - Deploy to web server
5. **Contribute** - Add improvements, submit PRs

---

## 📚 Additional Resources

- **Docusaurus Docs**: https://docusaurus.io/
- **Transformers.js**: https://github.com/xenova/transformers.js
- **Express.js**: https://expressjs.com/
- **React**: https://react.dev/

---

## 💡 Tips & Tricks

### Development Mode

For faster development, skip RAG server:
```bash
npm start
# Browse documentation without chatbot
```

### Production Build

```bash
npm run build
npm run serve
# Optimized build runs on http://localhost:3000
```

### Add Your Own Content

1. Create new `.md` file in `/docs/section-name/`
2. Update `sidebars.js` to add to navigation
3. Run: `npm run rag:ingest && npm run rag:embed`

### Use Different Embedding Model

In `rag/embed.js`, change:
```javascript
embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
// To:
embedder = await pipeline('feature-extraction', 'Xenova/all-mpnet-base-v2');
```

Then re-generate embeddings.

---

## 📞 Getting Help

If you run into issues:

1. **Check console output** - Error messages are descriptive
2. **Re-read troubleshooting** above
3. **Check GitHub issues** - https://github.com/panaversity/spec-kit-plus/issues
4. **Ask in discussions** - https://github.com/panaversity/spec-kit-plus/discussions

---

## ✨ Success Checklist

- ✅ Node.js 16+ installed
- ✅ `npm install` completed
- ✅ `npm run rag:ingest` created chunks.json
- ✅ `npm run rag:embed` created store.json
- ✅ `npm run rag:serve` shows "RAG Server running"
- ✅ `npm start` shows "Docusaurus server started"
- ✅ http://localhost:3000 opens in browser
- ✅ Chat button appears (bottom right)
- ✅ Can ask questions and get answers

---

🎉 **You're all set! Enjoy the RAG-powered textbook!**

Questions? Open an issue on GitHub or check the FAQ in the textbook itself.

---

**Last Updated:** December 2025  
**Version:** 1.0  
**Tested On:** Windows 11, macOS 12+, Ubuntu 20.04+
