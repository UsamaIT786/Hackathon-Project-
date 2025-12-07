/**
 * Express server - RAG API backend
 * Endpoint: POST /api/chat
 * 
 * Usage: node rag/server.js
 * Server runs on http://localhost:3001
 */

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { searchByText } from './search.js';
import { pipeline } from '@xenova/transformers';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize text generation model (lazy load)
let generationModel = null;

async function initGenerationModel() {
  if (generationModel) return generationModel;
  
  console.log('🔄 Loading text generation model (first time: ~2min)...');
  try {
    generationModel = await pipeline('text-generation', 'Xenova/distilgpt2');
    console.log('✅ Generation model loaded');
  } catch (error) {
    console.warn('⚠️  Generation model unavailable, using template responses');
    generationModel = null;
  }
  
  return generationModel;
}

/**
 * Generate response using retrieved context
 */
async function generateResponse(query, context) {
  // Build prompt
  const systemPrompt = `You are an AI assistant that answers questions about Physical AI, Prompt Engineering, and Robotic Intelligence. 
Use ONLY the textbook content provided below. If the answer is not in the context, say "I don't have that information in the textbook."

TEXTBOOK CONTENT:
${context}

QUESTION: ${query}

ANSWER:`;

  try {
    const model = await initGenerationModel();
    
    if (!model) {
      // Fallback: template response
      return generateTemplateResponse(query, context);
    }
    
    const output = await model(systemPrompt, {
      max_new_tokens: 200,
      temperature: 0.7,
      top_p: 0.9
    });
    
    return output[0].generated_text.replace(systemPrompt, '').trim();
  } catch (error) {
    console.error('Generation error:', error.message);
    return generateTemplateResponse(query, context);
  }
}

/**
 * Fallback template response when generation model unavailable
 */
function generateTemplateResponse(query, context) {
  const keywords = query.toLowerCase().split(/\s+/);
  const contextLines = context.split('\n').filter(l => l.trim());
  
  // Find most relevant lines from context
  const relevantLines = contextLines
    .filter(line => keywords.some(kw => line.toLowerCase().includes(kw)))
    .slice(0, 3);
  
  if (relevantLines.length > 0) {
    return `Based on the textbook:\n\n${relevantLines.join('\n\n')}`;
  }
  
  return `I found relevant information in the textbook, but I cannot generate a detailed response without the full generation model. Here's the context:\n\n${context.substring(0, 500)}...`;
}

/**
 * Format retrieved chunks into context string
 */
function formatContext(chunks) {
  return chunks
    .map((chunk, idx) => {
      const source = `[${chunk.metadata.section}] ${chunk.metadata.title}`;
      const confidence = Math.round(chunk.score * 100);
      return `[${idx + 1}] (${confidence}% match) ${source}\n${chunk.text.substring(0, 400)}...`;
    })
    .join('\n\n---\n\n');
}

/**
 * Chat endpoint
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Invalid message' });
    }
    
    // Search for relevant chunks
    const results = searchByText(message, 4);
    
    if (results.length === 0) {
      return res.json({
        reply: "I couldn't find relevant information in the textbook to answer your question.",
        sources: []
      });
    }
    
    // Format context
    const context = formatContext(results);
    
    // Generate response
    const reply = await generateResponse(message, context);
    
    // Format sources
    const sources = results.map(r => ({
      title: r.metadata.title,
      section: r.metadata.section,
      file: r.metadata.file,
      confidence: Math.round(r.score * 100)
    }));
    
    res.json({
      reply,
      sources
    });
    
  } catch (error) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({
      error: error.message,
      reply: 'Sorry, there was an error processing your question.'
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    vectorStore: fs.existsSync('rag/store.json') ? 'ready' : 'not initialized'
  });
});

/**
 * Start server
 */
async function startServer() {
  try {
    // Initialize models on startup
    await initGenerationModel();
    
    app.listen(PORT, () => {
      console.log(`\n🚀 RAG Server running on http://localhost:${PORT}`);
      console.log(`📝 POST /api/chat - ask questions`);
      console.log(`💚 GET /api/health - check server status`);
      console.log(`\n⏸️  Press Ctrl+C to stop\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
