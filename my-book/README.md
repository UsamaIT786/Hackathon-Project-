# 📚 Physical AI, Prompt Engineering & Robotic Intelligence - Complete Guide

A comprehensive textbook with integrated RAG-powered AI chatbot.

## 🎯 Quick Start

### Prerequisites
- Node.js 16+ 
- npm 7+

### 1. Install Dependencies

```bash
cd my-book
npm install
```

This installs:
- `@docusaurus/core` - Documentation framework
- `@xenova/transformers` - ML models for embeddings & text generation
- `express` & `cors` - Backend API server

### 2. Process Documents (One-time Setup)

```bash
# Extract and chunk all markdown files
npm run rag:ingest

# Generate embeddings for all chunks
npm run rag:embed
```

These commands create:
- `rag/chunks.json` - Chunked documents (~1-2 MB)
- `rag/store.json` - Vector embeddings (~5-10 MB)

**First run:** Embedding generation takes 2-3 minutes (downloads ~500 MB model)

### 3. Start the System (3 Terminals Recommended)

**Terminal 1: RAG Server**
```bash
npm run rag:serve
# Server runs on http://localhost:3001
```

**Terminal 2: Docusaurus**
```bash
npm start
# Documentation runs on http://localhost:3000
```

**Terminal 3: Optional - Monitor**
```bash
# Keep an eye on console logs
```

### 4. Visit the Site

Open http://localhost:3000 in your browser.

You'll see:
- 📖 Full textbook navigation on the left
- 💬 **Chat button** (bottom right) - click to open AI assistant
- 🔍 Search and browse all chapters

---

## 🤖 Using the AI Chatbot

### Features

✅ **Ask Any Question**  
"What is sensor fusion?" → Chatbot searches textbook and answers with citations

✅ **See Sources**  
Each response shows confidence % and links to source chapters

✅ **Streaming Responses**  
Answers appear character-by-character for smooth UX

✅ **Clear Chat**  
Button to reset conversation history

### Example Questions

- "What are the three pillars of Physical AI?"
- "How do I set up ROS on my computer?"
- "Explain chain-of-thought prompting"
- "What's the difference between a servo and a stepper motor?"
- "How does SLAM work in robotics?"

---

## 📁 Project Structure

```
my-book/
├── docs/
│   ├── index.md                    # Homepage
│   ├── introduction/               # 5 chapters
│   ├── physical-ai/               # 6 chapters
│   ├── prompt-engineering/        # 8 chapters
│   ├── robotic-ai/                # 7 chapters
│   ├── applied-ai/                # 5 chapters
│   ├── tools/                     # 3 chapters
│   ├── glossary/                  # 1 glossary
│   ├── references/                # Resources & books
│   └── faq/                       # Common questions
│
├── rag/                           # RAG Backend
│   ├── ingest.js                 # Document processing
│   ├── embed.js                  # Embedding generation
│   ├── server.js                 # Express API
│   ├── search.js                 # Vector search
│   ├── utils.js                  # Helper functions
│   ├── chunks.json               # Processed docs (generated)
│   └── store.json                # Vector store (generated)
│
├── src/
│   ├── components/
│   │   └── Chatbot/
│   │       ├── index.jsx         # React chat widget
│   │       └── style.module.css  # Chat styling
│   ├── theme/
│   │   └── Root.js              # App wrapper with chatbot
│   └── css/
│       └── custom.css            # Global styles
│
├── sidebars.js                   # Navigation structure
├── docusaurus.config.js          # Docusaurus config
├── package.json                  # Dependencies
└── README.md                     # This file
```

---

## 🔧 NPM Scripts

### Documentation
```bash
npm start          # Development server (localhost:3000)
npm run build      # Production build
npm run serve      # Serve built site
npm run clear      # Clear build cache
```

### RAG System
```bash
npm run rag:ingest    # Extract documents → chunks.json
npm run rag:embed     # Generate embeddings → store.json
npm run rag:serve     # Start API server (port 3001)
npm run rag:all       # Run all three RAG steps
```

---

## 🧠 How the Chatbot Works

### Pipeline

```
User Message
    ↓
[Server: /api/chat]
    ↓
Vector Search (cosine similarity)
    ↓
Top 4 Most Relevant Chunks Retrieved
    ↓
Prompt Construction
    ↓
LLM Response Generation
    ↓
Sources & Confidence Scores
    ↓
UI Displays Answer + Citations
```

### Technology Stack

- **Document Ingestion**: Node.js fs module + regex parsing
- **Embeddings**: Xenova/all-MiniLM-L6-v2 (384-dim vectors)
- **Search**: Cosine similarity on CPU
- **Generation**: Xenova/distilgpt2 (local, no API calls)
- **Backend**: Express.js on Node.js
- **Frontend**: React with Docusaurus

### Why This Stack?

✅ **No external APIs** - Everything runs locally  
✅ **No database** - JSON-based vector store  
✅ **No GPU required** - Works on CPU  
✅ **Cross-platform** - Windows, Mac, Linux  
✅ **Fast** - Embedding search < 100ms  

---

## 🚀 Advanced Usage

### Add More Documents

To add new chapters:

1. **Create markdown file** in appropriate `/docs` subfolder
2. **Run ingestion again**:
   ```bash
   npm run rag:ingest
   npm run rag:embed
   ```
3. **Restart RAG server**:
   ```bash
   npm run rag:serve
   ```

### Customize Chatbot

Edit `/src/components/Chatbot/index.jsx` and `/style.module.css`:
- Change colors: Look for `#667eea` (primary) and `#764ba2` (secondary)
- Modify layout: Update flexbox properties in CSS
- Change API endpoint: Update `http://localhost:3001` in fetch call
- Adjust response length: Modify `max_new_tokens` in `rag/server.js`

### Adjust Search Parameters

In `rag/search.js`:
```javascript
export function searchByText(query, topK = 4) {  // Change topK here
  // Returns top K most similar chunks
}
```

In `rag/server.js`:
```javascript
const results = searchByText(message, 4);  // Adjust top-K
```

### Performance Tuning

**Chunk Size** (in `rag/utils.js`):
```javascript
chunkText(cleaned, chunkSize = 2000)  // Smaller = more chunks, slower search
```

**Embedding Dimension** (in `rag/embed.js`):
- Current: all-MiniLM-L6-v2 (384-dim)
- Smaller: all-MiniLM-L6-v1 (faster but less accurate)
- Larger: all-mpnet-base-v2 (slower but more accurate)

---

## 🐛 Troubleshooting

### "Cannot find module @xenova/transformers"
```bash
npm install @xenova/transformers
```

### "Vector store not found"
Make sure you ran:
```bash
npm run rag:ingest
npm run rag:embed
```

### "Connection refused on port 3001"
RAG server not running:
```bash
npm run rag:serve
```

### "Slow response from chatbot"
- First run loads model (~1-2 min) - normal
- Subsequent runs should be < 1 sec
- If slow: Reduce `topK` or chunk size

### "Chatbot button doesn't appear"
1. Check console (F12) for errors
2. Verify Docusaurus built successfully
3. Clear browser cache: Ctrl+Shift+Delete

### Windows PowerShell Issues
Use:
```powershell
npm run rag:ingest -- --no-progress
```

Or use Command Prompt (cmd.exe) instead

---

## 📊 Content Statistics

| Section | Files | Topics |
|---------|-------|--------|
| Introduction | 5 | Learning paths, history, foundations |
| Physical AI | 6 | Sensors, vision, control, real-time |
| Prompt Engineering | 8 | Fundamentals, techniques, production |
| Robotic AI | 7 | Robotics, manipulation, learning |
| Applied AI | 5 | Real-world case studies, ethics |
| Tools | 3 | Frameworks, platforms, setup |
| Reference | 3 | Glossary, resources, FAQ |
| **TOTAL** | **37** | **50,000+ words** |

---

## 🔐 Privacy & Data

- ✅ All data stored locally
- ✅ No external API calls (models run locally)
- ✅ No tracking or analytics
- ✅ No user data collected
- ✅ Fully offline capable after initial setup

---

## 📜 License

MIT License - Free for personal and commercial use

---

## 🤝 Contributing

Found a typo or have an improvement?

1. Fork: https://github.com/panaversity/spec-kit-plus
2. Edit: Fix or add content
3. Test: Run locally and verify
4. Submit: Open a pull request

---

## 🎓 Learning Path Recommendation

### Week 1-2: Foundations
- Read Introduction section
- Watch referenced videos
- Run example code

### Week 3-4: Choose Your Focus
**Robotics Path**: Physical AI → Robotic AI → Applied AI  
**AI/ML Path**: Prompt Engineering → Applied AI → Tools  
**Full Path**: All three in order

### Week 5-6: Hands-On Project
- Set up development environment (Tools section)
- Build small project from "Building Your First System"
- Experiment with prompt techniques
- Write summary blog post

### Week 7+: Deepen Knowledge
- Dive into research papers (References)
- Join communities (Discord, Reddit, Stack Overflow)
- Contribute to open-source projects
- Build larger project

---

## 📞 Support

- **Questions?** Check FAQ section
- **Bug report?** Open GitHub issue
- **Feature request?** Discuss in GitHub Discussions
- **Want to chat?** Use the AI chatbot! 🤖

---

## 🙏 Credits

Built with:
- 📚 Docusaurus (documentation framework)
- 🤖 Hugging Face Transformers (ML models)
- ⚡ Express.js (web server)
- ⚛️ React (UI components)
- ❤️ Community contributions

---

**Last Updated:** December 2025  
**Version:** 1.0  
**Status:** Production Ready ✨

Enjoy exploring Physical AI, Prompt Engineering, and Robotic Intelligence!
