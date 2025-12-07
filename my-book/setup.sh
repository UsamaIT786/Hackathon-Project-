#!/bin/bash
# RAG Setup Script for my-book
# This script automates the RAG system setup

set -e  # Exit on error

echo "🚀 Physical AI & Robotics - RAG Chatbot Setup"
echo "=============================================="
echo ""

# Check Node.js version
echo "✓ Checking Node.js..."
node_version=$(node -v)
echo "  Using: $node_version"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo "  This may take 2-3 minutes on first run..."
npm install --legacy-peer-deps
echo "  ✓ Dependencies installed"
echo ""

# Ingest documents
echo "📄 Processing documents..."
echo "  Extracting and chunking markdown files..."
npm run rag:ingest
echo "  ✓ Documents processed"
echo ""

# Generate embeddings
echo "🧠 Generating embeddings..."
echo "  ⏳ This takes 2-3 minutes on first run (downloads model)"
echo "  ⏳ Subsequent runs are much faster"
npm run rag:embed
echo "  ✓ Embeddings generated"
echo ""

echo "✨ Setup complete!"
echo ""
echo "🚀 To start the system, run three commands in separate terminals:"
echo ""
echo "Terminal 1 (RAG Server):"
echo "  npm run rag:serve"
echo ""
echo "Terminal 2 (Docusaurus):"
echo "  npm start"
echo ""
echo "Then visit: http://localhost:3000"
echo ""
echo "💬 Look for the chat button in the bottom right corner!"
echo ""
