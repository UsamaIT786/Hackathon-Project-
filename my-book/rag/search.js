/**
 * Search module - semantic similarity search over embeddings
 */

import fs from 'fs';

const STORE_FILE = 'rag/store.json';

let vectorStore = null;

/**
 * Load vector store from disk
 */
function loadVectorStore() {
  if (vectorStore) return vectorStore;
  
  if (!fs.existsSync(STORE_FILE)) {
    throw new Error(`Vector store not found at ${STORE_FILE}. Run 'npm run rag:embed' first.`);
  }
  
  vectorStore = JSON.parse(fs.readFileSync(STORE_FILE, 'utf-8'));
  console.log(`✅ Loaded vector store: ${vectorStore.totalChunks} chunks`);
  
  return vectorStore;
}

/**
 * Cosine similarity between two vectors
 */
function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) {
    throw new Error('Vector dimensions must match');
  }
  
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magnitudeA += vecA[i] * vecA[i];
    magnitudeB += vecB[i] * vecB[i];
  }
  
  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);
  
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }
  
  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Get embedding for query text
 * Simple approach: average embeddings of similar chunks (used as fallback)
 */
function getQueryEmbedding(query, embeddingDimension) {
  // Simple heuristic: create embedding based on query tokens
  // In production, use same model as chunks
  const embedding = new Array(embeddingDimension).fill(0);
  
  const words = query.toLowerCase().split(/\s+/);
  words.forEach(word => {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = ((hash << 5) - hash) + word.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    
    for (let i = 0; i < embeddingDimension; i++) {
      embedding[i] += Math.sin(hash * (i + 1)) * 0.01;
    }
  });
  
  // Normalize
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  if (magnitude > 0) {
    for (let i = 0; i < embedding.length; i++) {
      embedding[i] /= magnitude;
    }
  }
  
  return embedding;
}

/**
 * Search for most relevant chunks
 */
export function search(queryEmbedding, topK = 4) {
  const store = loadVectorStore();
  
  // Score all chunks
  const scored = store.chunks.map(chunk => ({
    ...chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding)
  }));
  
  // Sort by score and get top K
  const results = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
  
  return results;
}

/**
 * Search by text query (when query embedding not available)
 */
export function searchByText(query, topK = 4) {
  const store = loadVectorStore();
  const queryEmbedding = getQueryEmbedding(query, store.embeddingDimension);
  return search(queryEmbedding, topK);
}

export default {
  loadVectorStore,
  search,
  searchByText,
  cosineSimilarity
};
