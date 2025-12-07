/**
 * RAG Ingest Pipeline
 * Reads all .md and .mdx files from ./docs/
 * Cleans markdown and splits into chunks
 * Saves chunks to rag/chunks.json
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');
const DOCS_DIR = path.join(PROJECT_ROOT, 'docs');
const OUTPUT_FILE = path.join(__dirname, 'chunks.json');

/**
 * Recursively find all .md and .mdx files
 */
async function findMarkdownFiles(dir) {
  const files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const subFiles = await findMarkdownFiles(fullPath);
      files.push(...subFiles);
    } else if (entry.isFile() && /\.(md|mdx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Clean markdown content by removing:
 * - Front matter (YAML)
 * - Code blocks
 * - HTML comments
 * - Multiple blank lines
 */
function cleanMarkdown(content) {
  // Remove front matter (--- ... ---)
  let cleaned = content.replace(/^---[\s\S]*?---\n/m, '');

  // Remove code blocks but keep the content (or remove entirely)
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '');

  // Remove HTML comments
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');

  // Remove extra whitespace and multiple blank lines
  cleaned = cleaned
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');

  return cleaned;
}

/**
 * Split text into chunks of approximately chunkSize tokens
 * Uses word-based splitting as a simple heuristic
 */
function splitIntoChunks(text, chunkSize = 500) {
  const words = text.split(/\s+/);
  const chunks = [];
  let currentChunk = [];
  let wordCount = 0;

  for (const word of words) {
    currentChunk.push(word);
    wordCount += 1;

    if (wordCount >= chunkSize) {
      chunks.push(currentChunk.join(' '));
      currentChunk = [];
      wordCount = 0;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' '));
  }

  return chunks.filter(chunk => chunk.length > 50);
}

/**
 * Main ingest function
 */
async function ingest() {
  try {
    console.log('🔍 Starting RAG ingestion...');
    console.log(`📂 Reading from: ${DOCS_DIR}`);

    // Find all markdown files
    const files = await findMarkdownFiles(DOCS_DIR);
    console.log(`📄 Found ${files.length} markdown files`);

    if (files.length === 0) {
      console.warn('⚠️  No markdown files found in docs/ directory');
      return;
    }

    // Read and process each file
    const allChunks = [];
    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        const cleaned = cleanMarkdown(content);
        const chunks = splitIntoChunks(cleaned, 500);

        for (const chunk of chunks) {
          allChunks.push({
            text: chunk,
            source: path.relative(PROJECT_ROOT, file),
            length: chunk.length,
          });
        }

        console.log(`  ✓ ${path.relative(DOCS_DIR, file)} → ${chunks.length} chunks`);
      } catch (error) {
        console.error(`  ✗ Error processing ${file}: ${error.message}`);
      }
    }

    // Save chunks to file
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(allChunks, null, 2));

    console.log(`\n✅ Ingestion complete!`);
    console.log(`📊 Statistics:`);
    console.log(`   - Files processed: ${files.length}`);
    console.log(`   - Total chunks: ${allChunks.length}`);
    console.log(`   - Avg chunk size: ${Math.round(allChunks.reduce((sum, c) => sum + c.length, 0) / allChunks.length)} chars`);
    console.log(`   - Output: ${path.relative(PROJECT_ROOT, OUTPUT_FILE)}`);
  } catch (error) {
    console.error('❌ Ingestion failed:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
ingest();
