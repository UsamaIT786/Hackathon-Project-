/**
 * RAG Search Server
 * Express API for semantic search using pre-computed embeddings
 * POST /api/rag - Query with semantic search
 */

import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { pipeline } from '@xenova/transformers';

// Get current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EMBEDDINGS_FILE = path.join(__dirname, 'embeddings.json');

// Configuration
const PORT = process.env.PORT || 5050;
const MODEL_NAME = 'Xenova/all-MiniLM-L6-v2';
const TOP_K = 3; // Return top 3 results

// Global state
let embeddings = [];
let extractor = null;

/**
 * Cosine similarity between two vectors
 */
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Load embeddings from file
 */
async function loadEmbeddings() {
  try {
    const content = await fs.readFile(EMBEDDINGS_FILE, 'utf-8');
    embeddings = JSON.parse(content);
    console.log(`✓ Loaded ${embeddings.length} embeddings`);
    return embeddings.length > 0;
  } catch (error) {
    console.error(`❌ Error loading embeddings: ${error.message}`);
    return false;
  }
}

/**
 * Initialize the embedding model
 */
async function initializeModel() {
  try {
    console.log(`🤖 Loading model: ${MODEL_NAME}`);
    extractor = await pipeline('feature-extraction', MODEL_NAME);
    console.log('✓ Model loaded');
    return true;
  } catch (error) {
    console.error(`❌ Error loading model: ${error.message}`);
    return false;
  }
}

/**
 * Embed a query string
 */
async function embedQuery(query) {
  try {
    const result = await extractor(query, {
      pooling: 'mean',
      normalize: true,
    });
    return Array.from(result.data);
  } catch (error) {
    console.error(`❌ Error embedding query: ${error.message}`);
    throw error;
  }
}

/**
 * Find top K similar embeddings
 */
function findTopSimilar(queryVector, k = TOP_K) {
  const scores = embeddings.map((emb, idx) => ({
    id: emb.id,
    text: emb.text,
    source: emb.source,
    score: cosineSimilarity(queryVector, emb.vector),
  }));

  // Sort by similarity score (descending)
  scores.sort((a, b) => b.score - a.score);

  // Return top K results
  return scores.slice(0, k);
}

/**
 * Initialize Express app
 */
function createApp() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Health check
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      model: MODEL_NAME,
      embeddings_count: embeddings.length,
    });
  });

  // Main RAG search endpoint
  app.post('/api/rag', async (req, res) => {
    try {
      const { query } = req.body;

      // Validate input
      if (!query || typeof query !== 'string' || query.trim().length === 0) {
        return res.status(400).json({
          error: 'Invalid request',
          message: 'Query must be a non-empty string',
        });
      }

      if (embeddings.length === 0) {
        return res.status(503).json({
          error: 'Service unavailable',
          message: 'No embeddings loaded. Run embed.mjs first.',
        });
      }

      // Embed query
      const queryVector = await embedQuery(query);

      // Find similar chunks
      const results = findTopSimilar(queryVector, TOP_K);

      // Return results
      res.json({
        query: query.substring(0, 100),
        results: results.map((r) => ({
          text: r.text.substring(0, 300) + (r.text.length > 300 ? '...' : ''),
          source: r.source,
          score: Number(r.score.toFixed(4)),
        })),
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({
        error: 'Search failed',
        message: error.message,
      });
    }
  });

  // Statistics endpoint
  app.get('/api/stats', (req, res) => {
    res.json({
      total_embeddings: embeddings.length,
      model: MODEL_NAME,
      top_k: TOP_K,
      uptime: process.uptime(),
    });
  });

  return app;
}

/**
 * Start the server
 */
async function startServer() {
  try {
    console.log('🚀 Starting RAG Search Server...\n');

    // Initialize model
    console.log('📦 Initializing resources...');
    const modelOk = await initializeModel();
    if (!modelOk) {
      console.error('Failed to load model');
      process.exit(1);
    }

    // Load embeddings
    const embeddingsOk = await loadEmbeddings();
    if (!embeddingsOk) {
      console.warn('⚠️  No embeddings loaded. Server will reject queries.');
    }

    // Create and start Express app
    const app = createApp();
    const server = app.listen(PORT, () => {
      console.log(`\n✅ RAG Server running on http://localhost:${PORT}`);
      console.log(`\n📍 Endpoints:`);
      console.log(`   GET  /health           - Health check`);
      console.log(`   POST /api/rag          - Semantic search`);
      console.log(`   GET  /api/stats        - Server statistics`);
      console.log(`\n💡 Example query:`);
      console.log(`   curl -X POST http://localhost:${PORT}/api/rag \\`);
      console.log(`     -H "Content-Type: application/json" \\`);
      console.log(`     -d '{"query": "your search query here"}'`);
      console.log('');
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down gracefully...');
      server.close(() => {
        console.log('✓ Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
startServer();
