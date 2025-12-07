/**
 * Ingest script - convert markdown files to chunks
 * Usage: node rag/ingest.js
 */

import fs from 'fs';
import path from 'path';
import {
  getAllMarkdownFiles,
  cleanMarkdown,
  chunkText,
  extractMetadata
} from './utils.js';

const OUTPUT_FILE = 'rag/chunks.json';

export async function ingestDocuments() {
  console.log('🔍 Starting document ingestion...');
  
  const markdownFiles = getAllMarkdownFiles();
  console.log(`📄 Found ${markdownFiles.length} markdown files`);
  
  const allChunks = [];
  let totalChunks = 0;
  
  markdownFiles.forEach((filePath, index) => {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const cleaned = cleanMarkdown(content);
      
      if (cleaned.length < 50) {
        console.log(`⚠️  Skipping ${path.basename(filePath)} (too small)`);
        return;
      }
      
      const metadata = extractMetadata(filePath, content);
      const chunks = chunkText(cleaned);
      
      chunks.forEach((chunkText, chunkIndex) => {
        allChunks.push({
          id: `${index}-${chunkIndex}`,
          text: chunkText,
          metadata,
          chunkIndex,
          charLength: chunkText.length
        });
      });
      
      totalChunks += chunks.length;
      console.log(`✅ ${path.basename(filePath)} → ${chunks.length} chunks`);
      
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  });
  
  // Write chunks to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allChunks, null, 2), 'utf-8');
  
  console.log(`\n✨ Ingestion complete!`);
  console.log(`📊 Total chunks: ${totalChunks}`);
  console.log(`💾 Saved to: ${OUTPUT_FILE}`);
  
  return allChunks;
}

// Run if called directly
ingestDocuments().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
