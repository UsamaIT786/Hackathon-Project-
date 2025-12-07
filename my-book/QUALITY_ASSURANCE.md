# 🧪 Quality Assurance & Testing Guide

Complete testing and verification guide for the RAG chatbot system.

---

## ✅ Pre-Launch Checklist

### Environment Setup

- [ ] Node.js 16+ installed (`node --version` shows v16+)
- [ ] npm 7+ installed (`npm --version` shows 7+)
- [ ] Internet connection available
- [ ] 7 GB free disk space
- [ ] Terminal/Command prompt access
- [ ] Text editor (VS Code recommended)

### File Verification

```bash
# Run verification script
bash verify.sh

# Or manually check key files exist
ls -la rag/ingest.js
ls -la src/components/Chatbot/index.jsx
ls -la docusaurus.config.js
```

Expected output: All files should exist

### Documentation Review

- [ ] Read QUICK_START.md
- [ ] Read SETUP_GUIDE.md
- [ ] Understand ARCHITECTURE.md
- [ ] Scan README.md for reference

---

## 🚀 Installation Testing

### Step 1: Dependency Installation

```bash
npm install
```

**Expected:**
```
added 500+ packages in ~3m
found 0 vulnerabilities
```

**If fails:**
- Check Node.js version: `node --version`
- Try: `npm install --legacy-peer-deps`
- Check internet connection
- Try: `npm cache clean --force` then `npm install`

**Verification:**
```bash
# Check if dependencies installed
ls node_modules/@docusaurus/core
ls node_modules/@xenova
```

---

## 📄 Ingest Testing

### Step 2: Document Ingestion

```bash
npm run rag:ingest
```

**Expected output:**
```
🔍 Starting document ingestion...
📄 Found 37 markdown files
✅ introduction/01-welcome.md → 5 chunks
... (more chapters)
✨ Ingestion complete!
📊 Total chunks: 156
💾 Saved to: rag/chunks.json
```

**If fails:**
- Check /docs folder exists with chapters
- Verify markdown files are readable
- Check file permissions
- Ensure sufficient disk space

**Verification:**
```bash
# Check chunks.json was created
ls -lh rag/chunks.json
# Should show ~1-2 MB file

# Verify chunks are valid JSON
node -e "console.log(JSON.parse(require('fs').readFileSync('rag/chunks.json')).length, 'chunks')"
# Should output: 156 chunks
```

---

## 🧠 Embedding Testing

### Step 3: Vector Generation

```bash
npm run rag:embed
```

**Expected output (first time):**
```
🧠 Starting embedding generation...
📦 Loaded 156 chunks from rag/chunks.json
🔄 Loading embedding model (first time may take ~1min)...
✅ Model loaded
⏳ Processed 10/156 chunks...
⏳ Processed 20/156 chunks...
... (progress to 156)
✨ Embedding complete!
💾 Vector store saved to: rag/store.json
📊 Dimension: 384
📦 Total vectors: 156
```

**If embedding model download fails:**
- Check internet connection
- Try using different network
- Check available disk space (~500 MB needed)
- Restart terminal and retry

**Verification:**
```bash
# Check store.json was created
ls -lh rag/store.json
# Should show ~5-10 MB file

# Verify store is valid JSON
node -e "
const store = JSON.parse(require('fs').readFileSync('rag/store.json'));
console.log('✓ Chunks:', store.chunks.length);
console.log('✓ Dimension:', store.embeddingDimension);
console.log('✓ First vector shape:', store.chunks[0].embedding.length);
"
```

**Expected output:**
```
✓ Chunks: 156
✓ Dimension: 384
✓ First vector shape: 384
```

---

## 🌐 Server Testing

### Step 4: RAG API Server

```bash
# Terminal 1
npm run rag:serve
```

**Expected output:**
```
🚀 RAG Server running on http://localhost:3001
📝 POST /api/chat - ask questions
💚 GET /api/health - check server status

⏸️  Press Ctrl+C to stop
```

**Testing endpoints:**

**Test 1: Health Check**
```bash
# In another terminal
curl http://localhost:3001/api/health
```

**Expected response:**
```json
{
  "status": "ok",
  "uptime": 42.5,
  "vectorStore": "ready"
}
```

**Test 2: Chat Endpoint**
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is Physical AI?"}'
```

**Expected response:**
```json
{
  "reply": "Physical AI refers to...",
  "sources": [
    {
      "title": "What is Physical AI",
      "section": "physical-ai",
      "confidence": 92
    },
    ...
  ]
}
```

---

## 🎨 Frontend Testing

### Step 5: Docusaurus Site

```bash
# Terminal 2 (keep Terminal 1 running)
npm start
```

**Expected output:**
```
[INFO] Docusaurus 3.0.0 running at...
[INFO] ⓘ You can now view my-book in the browser.
[SUCCESS] Docusaurus server started successfully.
```

### Visual Verification

1. **Open browser:** http://localhost:3000
2. **Check homepage:**
   - ✅ Title displays: "Physical AI, Prompt Engineering & Robotic Intelligence"
   - ✅ Navigation appears on left
   - ✅ Content loads properly
   - ✅ No console errors (F12 → Console tab)

3. **Check chat button:**
   - ✅ Purple circle visible in bottom-right
   - ✅ Button has hover effect
   - ✅ Can click to open chat

4. **Open chat widget:**
   - ✅ Chat window appears smoothly
   - ✅ Initial greeting message visible
   - ✅ Input field is visible
   - ✅ Send button is visible

---

## 💬 Chat Functionality Testing

### Test 1: Basic Message

**Action:** Type "What is a robot?" and press Enter

**Expected behavior:**
- ✅ Message appears in chat
- ✅ Loading indicator appears
- ✅ Response arrives within 3 seconds
- ✅ Response is relevant to question
- ✅ Source citations appear below response

**Test:** Pass/Fail

### Test 2: Source Display

**Check response includes:**
- ✅ Source title
- ✅ Section name (e.g., "robotic-ai")
- ✅ Confidence percentage (should be 60-95%)

**Test:** Pass/Fail

### Test 3: Multiple Messages

**Action:** Ask 3 different questions in sequence

**Expected:**
- ✅ All messages stay in history
- ✅ Chat scrolls to bottom automatically
- ✅ Each response is different and relevant
- ✅ No errors in console

**Test:** Pass/Fail

### Test 4: Clear History

**Action:** Click "Clear" button

**Expected:**
- ✅ Chat history cleared
- ✅ Initial greeting reappears
- ✅ Ready for new conversation

**Test:** Pass/Fail

### Test 5: Keyboard Shortcuts

**Action:** Type message and press Enter

**Expected:**
- ✅ Message sends (same as click)
- ✅ Input cleared
- ✅ Response generated

**Test:** Pass/Fail

---

## 🧪 Edge Case Testing

### Test: Long Question

**Input:** "This is a very long question about sensor fusion and how it combines data from multiple sensors including lidar, radar, and cameras to create a comprehensive understanding of the environment..."

**Expected:**
- ✅ Message handled correctly
- ✅ Response generated
- ✅ No truncation issues

**Test:** Pass/Fail

### Test: Special Characters

**Input:** "What is AI? (machine learning) & neural networks!"

**Expected:**
- ✅ Sends correctly
- ✅ Response generated
- ✅ No encoding issues

**Test:** Pass/Fail

### Test: Off-Topic Question

**Input:** "What is quantum physics?"

**Expected:**
- ✅ Response indicates not in textbook
- ✅ Graceful handling
- ✅ No error message

**Test:** Pass/Fail

### Test: Typos

**Input:** "Wht is sensro fusin?"

**Expected:**
- ✅ Still finds relevant results (fuzzy matching helps)
- ✅ Response is helpful

**Test:** Pass/Fail

---

## 🔧 Error Recovery Testing

### Test: Stop RAG Server

**Action:** Stop RAG server (Ctrl+C in Terminal 1)

**Expected in chat:**
- ✅ Message shows "Connection refused"
- ✅ Clear error message
- ✅ Suggests restarting server

**Test:** Pass/Fail

### Test: Stop Docusaurus

**Action:** Stop Docusaurus (Ctrl+C in Terminal 2)

**Expected:**
- ✅ Page still shows (cached from memory)
- ✅ New requests fail gracefully
- ✅ Restart works cleanly

**Test:** Pass/Fail

### Test: Browser Refresh

**Action:** Refresh page (F5)

**Expected:**
- ✅ Page loads correctly
- ✅ Chat history cleared (normal behavior)
- ✅ Ready for new conversation

**Test:** Pass/Fail

---

## 📊 Performance Testing

### Metric 1: Page Load Time

**Measurement:** Time to http://localhost:3000 fully loaded

**Expected:** < 3 seconds

**How to measure:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Check "Finish" time

**Result:** _____ ms (Target: < 3000 ms)

### Metric 2: Chat Response Time

**Measurement:** Time from pressing Enter to first response character

**Expected:** < 500 ms for search + context setup (generation varies)

**How to measure:**
1. Open DevTools Network tab
2. Ask question
3. Watch POST /api/chat request
4. Check response time

**Result:** _____ ms (Target: < 500 ms for retrieval)

### Metric 3: Search Quality

**Measurement:** Are top results relevant?

**Test questions:**
- "What is sensor fusion?" → Top result should mention "sensor fusion"
- "How do robots perceive?" → Top result should mention robot perception
- "Explain prompt engineering" → Top result should mention prompt engineering

**Evaluation:** 
- 1st result relevance: ___/100
- 2nd result relevance: ___/100
- 3rd result relevance: ___/100
- Average: ___/100 (Target: > 80%)

---

## 🎯 Cross-Browser Testing

### Browser 1: Chrome/Chromium

- [ ] Page loads
- [ ] Chat button visible
- [ ] Chat opens smoothly
- [ ] Messages send/receive
- [ ] No console errors

### Browser 2: Firefox

- [ ] Page loads
- [ ] Chat button visible
- [ ] Chat opens smoothly
- [ ] Messages send/receive
- [ ] No console errors

### Browser 3: Safari (Mac)

- [ ] Page loads
- [ ] Chat button visible
- [ ] Chat opens smoothly
- [ ] Messages send/receive
- [ ] No console errors

### Browser 4: Edge (Windows)

- [ ] Page loads
- [ ] Chat button visible
- [ ] Chat opens smoothly
- [ ] Messages send/receive
- [ ] No console errors

---

## 📱 Mobile Testing

### Viewport: iPhone X (375px width)

**Test:**
- [ ] Page responsive
- [ ] Chat button visible
- [ ] Chat opens full-screen or overlay
- [ ] Can type and send messages
- [ ] Keyboard doesn't break layout

**Result:** Pass/Fail

### Viewport: iPad (768px width)

**Test:**
- [ ] Page responsive
- [ ] Chat window properly sized
- [ ] Easy to interact with
- [ ] Text readable

**Result:** Pass/Fail

---

## 🔐 Security Testing

### Test: Input Sanitization

**Action:** Try pasting HTML in chat

```html
<script>alert('XSS')</script>
```

**Expected:**
- ✅ Displayed as text, not executed
- ✅ No XSS vulnerability

**Result:** Pass/Fail

### Test: API Rate Limiting (Optional)

**Action:** Send 100 requests in 10 seconds

**Expected:**
- ✅ Either all succeed or reasonable rate limit applied
- ✅ No server crash

**Result:** Pass/Fail

---

## 📋 Test Results Summary

### Date: _____________

### Environment
- OS: _____________
- Node.js: _____________
- Browser: _____________

### Critical Tests (Must Pass)

| Test | Expected | Actual | Status |
|------|----------|--------|--------|
| npm install completes | Success | | ✅/❌ |
| rag:ingest creates chunks.json | Success | | ✅/❌ |
| rag:embed creates store.json | Success | | ✅/❌ |
| RAG server starts | Port 3001 | | ✅/❌ |
| API /health endpoint | 200 OK | | ✅/❌ |
| Docusaurus loads | Port 3000 | | ✅/❌ |
| Chat button visible | Yes | | ✅/❌ |
| Chat sends message | Receives response | | ✅/❌ |
| Response includes sources | 1-4 sources | | ✅/❌ |

### Functional Tests (Should Pass)

| Test | Expected | Status |
|------|----------|--------|
| Long message handling | No errors | ✅/❌ |
| Special characters | No errors | ✅/❌ |
| Multiple messages | All display | ✅/❌ |
| Clear history | Works | ✅/❌ |
| Error recovery | Graceful | ✅/❌ |
| Page refresh | No data loss | ✅/❌ |
| Browser compatibility | Works in 3+ browsers | ✅/❌ |
| Mobile responsive | Works on mobile | ✅/❌ |

### Performance Tests (Target Values)

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Page load time | < 3s | | ✅/❌ |
| Chat response time | < 500ms | | ✅/❌ |
| Search quality | > 80% | | ✅/❌ |

---

## 🔍 Debugging Checklist

If tests fail:

### 1. Check Logs

```bash
# Terminal 1 (RAG Server) - Check for errors
# Terminal 2 (Docusaurus) - Check for errors
# Browser Console (F12) - Check for errors
```

### 2. Verify Files

```bash
# Check all required files exist
ls rag/*.js
ls src/components/Chatbot/*
ls docs/*.md
```

### 3. Verify Services

```bash
# Check services are running
curl http://localhost:3001/api/health
curl http://localhost:3000
```

### 4. Clear Cache

```bash
npm cache clean --force
rm -rf node_modules
rm package-lock.json
npm install
```

### 5. Check Dependencies

```bash
npm list @xenova/transformers
npm list express
npm list react
```

---

## ✨ Sign-Off

Once all critical tests pass, the system is ready for use:

**Date Tested:** __________  
**Tester Name:** __________  
**OS/Environment:** __________  
**Result:** ✅ PASS / ❌ FAIL  

**Notes:** ___________________________________

---

## 📞 Getting Help

If tests fail:

1. Check **SETUP_GUIDE.md** troubleshooting section
2. Review console output carefully
3. Verify file locations and permissions
4. Check Node.js version compatibility
5. Clear cache and reinstall

---

**QA Version:** 1.0  
**Last Updated:** December 2025  
**Status:** Complete ✨
