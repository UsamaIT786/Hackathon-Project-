---
title: Home
slug: /
---

# Physical AI, Prompt Engineering & Robotic Intelligence

A comprehensive guide to understanding and building intelligent physical systems.

## 🚀 Welcome

This textbook covers three interconnected pillars of modern AI:

- **Physical AI** - Perception and control in the real world
- **Prompt Engineering** - Communicating with large language models
- **Robotic Intelligence** - Building autonomous agents

## 📚 What You'll Learn

- Fundamental concepts from sensors to neural networks
- Practical techniques for building AI systems
- Real-world case studies: autonomous vehicles, medical robots, industrial automation
- Production patterns for safe, reliable deployment
- Ethical considerations in AI development

## 💬 AI Assistant

A **RAG-powered chatbot** is available (bottom right corner). Ask questions about any topic covered in the textbook!

## 🎯 How to Use This Guide

1. **Start with Introduction** - Get context and learning paths
2. **Choose your path** - Dive into Physical AI, Prompt Engineering, or Robotics
3. **Follow chapters sequentially** - Each builds on previous concepts
4. **Try the examples** - Code samples and exercises throughout
5. **Reference the glossary** - Quick definitions of key terms

## 🛠️ Setup Instructions

### For Reading Only
Just browse the chapters - no setup needed!

### To Use the AI Chatbot
The chatbot requires a running backend server:

```bash
# 1. Install dependencies
npm install

# 2. Ingest documents
npm run rag:ingest

# 3. Generate embeddings
npm run rag:embed

# 4. Start RAG server (new terminal)
npm run rag:serve

# 5. Start Docusaurus (another terminal)
npm start
```

The chatbot will appear as a floating widget on the page.

## 📖 Textbook Structure

- **Introduction** (5 chapters)
  - Welcome, Three Pillars, Historical Context, Why Now, Getting Started

- **Physical AI** (6 chapters)
  - Sensors, Computer Vision, Sensor Fusion, Motion Control, Real-time Systems

- **Prompt Engineering** (8 chapters)
  - Foundations, Advanced Techniques, Few-shot Learning, Function Calling, Production

- **Robotic AI** (7 chapters)
  - Robot Basics, Perception, Decision Making, Manipulation, Human-Robot Interaction

- **Applied AI** (5 chapters)
  - Case Studies: Autonomous Vehicles, Industry, Healthcare, Building Systems, Ethics

- **Tools** (3 chapters)
  - Frameworks, Platforms, Development Environment Setup

- **Reference** (3 chapters)
  - Glossary, Resources & Books, FAQ

## 🤖 AI Assistant Features

The chatbot powered by RAG (Retrieval-Augmented Generation):

✅ **Answers questions** using textbook content  
✅ **Cites sources** with confidence levels  
✅ **Works offline** - all data stored locally  
✅ **Fast retrieval** using vector embeddings  
✅ **Always learning** - add more documents anytime  

## 🔧 For Developers

### Architecture

```
my-book/
├── docs/                 # Markdown chapters
├── rag/                  # RAG backend
│   ├── ingest.js        # Extract and chunk documents
│   ├── embed.js         # Generate embeddings
│   ├── server.js        # Express API
│   └── search.js        # Vector similarity search
├── src/
│   ├── components/
│   │   └── Chatbot/     # React chat widget
│   ├── theme/
│   │   └── Root.js      # App layout
│   └── css/
└── docusaurus.config.js # Configuration
```

### API Endpoints

**POST /api/chat**
```json
Request:
{
  "message": "What is Physical AI?"
}

Response:
{
  "reply": "Physical AI refers to...",
  "sources": [
    {
      "title": "Chapter Title",
      "section": "physical-ai",
      "confidence": 95
    }
  ]
}
```

**GET /api/health**
- Server status and vector store readiness

## 📝 Contributing

Found an error? Have a suggestion? Contributions welcome!

1. Fork: https://github.com/panaversity/spec-kit-plus
2. Edit: Make your changes
3. Submit: Create a pull request

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Support

- **Questions?** Check the FAQ section
- **Need help?** Open an issue on GitHub
- **Want to contribute?** See CONTRIBUTING.md

---

**Last updated:** December 2025  
**Version:** 1.0  
**Status:** Complete ✨
