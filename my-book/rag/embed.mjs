/**
 * RAG Embedding Pipeline
 * Loads chunks from rag/chunks.json
 * Generates embeddings using Xenova/all-MiniLM-L6-v2
 * Saves vectors to rag/embeddings.json
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { pipeline } from '@xenova/transformers';

// Get current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHUNKS_FILE = path.join(__dirname, 'chunks.json');
const OUTPUT_FILE = path.join(__dirname, 'embeddings.json');

// Model configuration
const MODEL_NAME = 'Xenova/all-MiniLM-L6-v2';
const BATCH_SIZE = 32;

/**
 * Load chunks from JSON file
 */
async function loadChunks() {
  try {
    const content = await fs.readFile(CHUNKS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Error loading chunks: ${error.message}`);
    throw error;
  }
}

/**
 * Initialize the embedding pipeline
 */
async function initializePipeline() {
  console.log(`🤖 Loading model: ${MODEL_NAME}`);
  console.log('   (This may take a moment on first run)');

  const extractor = await pipeline('feature-extraction', MODEL_NAME);
  return extractor;
}

/**
 * Process chunks in batches for efficient embedding
 */
async function embedChunks(chunks, extractor) {
  const embeddings = [];
  const totalChunks = chunks.length;

  console.log(`\n📊 Embedding ${totalChunks} chunks in batches of ${BATCH_SIZE}...`);

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, Math.min(i + BATCH_SIZE, chunks.length));
    const texts = batch.map(c => c.text);

    try {
      // Generate embeddings for batch
      const results = await extractor(texts, {
        pooling: 'mean',
        normalize: true,
      });

      // Process each result
      for (let j = 0; j < batch.length; j++) {
        const chunk = batch[j];
        const vector = Array.from(results[j].data);

        embeddings.push({
          id: embeddings.length,
          text: chunk.text,
          source: chunk.source,
          vector: vector,
          length: chunk.length,
        });
      }

      // Log progress
      const processed = Math.min(i + BATCH_SIZE, totalChunks);
      const percentage = Math.round((processed / totalChunks) * 100);
      console.log(`  ✓ ${processed}/${totalChunks} (${percentage}%)`);
    } catch (error) {
      console.error(`  ✗ Error embedding batch at index ${i}: ${error.message}`);
      throw error;
    }
  }

  return embeddings;
}

/**
 * Main embedding function
 */
async function embed() {
  try {
    console.log('🚀 Starting RAG embedding pipeline...\n');

    // Load chunks
    console.log('📖 Loading chunks...');
    const chunks = await loadChunks();
    console.log(`✓ Loaded ${chunks.length} chunks\n`);

    if (chunks.length === 0) {
      console.warn('⚠️  No chunks found. Run ingest.mjs first.');
      return;
    }

    // Initialize embedding model
    const extractor = await initializePipeline();

    // Embed all chunks
    const embeddings = await embedChunks(chunks, extractor);

    // Save embeddings
    console.log(`\n💾 Saving embeddings to disk...`);
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(embeddings, null, 2));

    console.log(`\n✅ Embedding complete!`);
    console.log(`📊 Statistics:`);
    console.log(`   - Total embeddings: ${embeddings.length}`);
    console.log(`   - Vector dimension: ${embeddings[0]?.vector?.length || 'N/A'}`);
    console.log(`   - Output file: ${path.basename(OUTPUT_FILE)}`);
    console.log(`   - File size: ${(embeddings.length * 100) / 1024 / 1024 || '~'} MB (approx)`);
  } catch (error) {
    console.error('❌ Embedding failed:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
embed();
