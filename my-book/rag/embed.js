/**
 * Embedding script - generate embeddings for chunks
 * Uses: https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2
 * 
 * First install: npm install @xenova/transformers
 * Then run: node rag/embed.js
 */

import fs from 'fs';
import { pipeline } from '@xenova/transformers';

const CHUNKS_FILE = 'rag/chunks.json';
const STORE_FILE = 'rag/store.json';

let embedder = null;

/**
 * Initialize embedder (lazy load)
 */
async function initEmbedder() {
  if (embedder) return embedder;
  
  console.log('🔄 Loading embedding model (first time may take ~1min)...');
  embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  console.log('✅ Model loaded');
  
  return embedder;
}

/**
 * Generate embedding for text
 */
async function generateEmbedding(text) {
  const emb = await embedder(text, { pooling: 'mean', normalize: true });
  return Array.from(emb.data);
}

/**
 * Main embedding function
 */
export async function generateEmbeddings() {
  console.log('🧠 Starting embedding generation...\n');
  
  // Load chunks
  if (!fs.existsSync(CHUNKS_FILE)) {
    console.error(`❌ ${CHUNKS_FILE} not found. Run 'npm run rag:ingest' first.`);
    process.exit(1);
  }
  
  const chunks = JSON.parse(fs.readFileSync(CHUNKS_FILE, 'utf-8'));
  console.log(`📦 Loaded ${chunks.length} chunks from ${CHUNKS_FILE}`);
  
  // Initialize embedder
  await initEmbedder();
  
  // Generate embeddings
  const embeddedChunks = [];
  const batchSize = 10;
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    
    try {
      const embedding = await generateEmbedding(chunk.text);
      embeddedChunks.push({
        ...chunk,
        embedding
      });
      
      // Progress indicator
      if ((i + 1) % batchSize === 0) {
        process.stdout.write(`\r⏳ Processed ${i + 1}/${chunks.length} chunks...`);
      }
    } catch (error) {
      console.error(`\n❌ Error embedding chunk ${chunk.id}:`, error.message);
    }
  }
  
  console.log(`\n✅ Generated ${embeddedChunks.length} embeddings`);
  
  // Save to vector store
  const store = {
    version: '1.0',
    modelId: 'Xenova/all-MiniLM-L6-v2',
    embeddingDimension: embeddedChunks[0]?.embedding?.length || 384,
    totalChunks: embeddedChunks.length,
    chunks: embeddedChunks,
    generatedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
  
  console.log(`\n✨ Embedding complete!`);
  console.log(`💾 Vector store saved to: ${STORE_FILE}`);
  console.log(`📊 Dimension: ${store.embeddingDimension}`);
  console.log(`📦 Total vectors: ${store.totalChunks}`);
}

// Run if called directly
generateEmbeddings().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
