/**
 * Utility functions for RAG processing
 */

import fs from 'fs';
import path from 'path';

/**
 * Get all markdown files from docs directory
 */
export function getAllMarkdownFiles() {
  const docsPath = path.join(process.cwd(), 'docs');
  const markdownFiles = [];

  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith('.md')) {
        markdownFiles.push(filePath);
      }
    });
  }

  walkDir(docsPath);
  return markdownFiles;
}

/**
 * Clean markdown text - remove frontmatter and formatting
 */
export function cleanMarkdown(content) {
  // Remove YAML frontmatter
  let text = content.replace(/^---[\s\S]*?---\n/, '');
  
  // Remove markdown headers and links
  text = text.replace(/#+\s/g, '');
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Remove code blocks (keep content but strip markers)
  text = text.replace(/```[\s\S]*?```/g, (match) => {
    return match.replace(/```[a-z]*\n?/g, '').replace(/```/g, '');
  });
  
  // Remove inline code markers
  text = text.replace(/`([^`]+)`/g, '$1');
  
  // Remove extra whitespace
  text = text.replace(/\n\n+/g, '\n\n');
  text = text.trim();
  
  return text;
}

/**
 * Split text into chunks of ~500-800 tokens
 * Rough estimate: 1 token ≈ 4 characters
 */
export function chunkText(text, chunkSize = 2000) {
  const chunks = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  
  let currentChunk = '';
  
  sentences.forEach(sentence => {
    if ((currentChunk + ' ' + sentence).length > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    }
  });
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

/**
 * Extract metadata from file
 */
export function extractMetadata(filePath, content) {
  // Get section from path (e.g., "physical-ai" from ".../physical-ai/01-...md")
  const section = filePath.split(path.sep).slice(-2)[0];
  
  // Extract title from content or filename
  const filenameTitle = path.basename(filePath, '.md').replace(/^\d+-/, '').replace(/-/g, ' ');
  const titleMatch = content.match(/title:\s*"([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : filenameTitle;
  
  return {
    section,
    title,
    file: path.relative(process.cwd(), filePath)
  };
}

/**
 * Tokenize text (rough approximation)
 */
export function tokenCount(text) {
  return Math.ceil(text.length / 4);
}

/**
 * Format chunk for display
 */
export function formatChunk(chunk, metadata) {
  return {
    text: chunk,
    metadata,
    tokens: tokenCount(chunk)
  };
}

export default {
  getAllMarkdownFiles,
  cleanMarkdown,
  chunkText,
  extractMetadata,
  tokenCount,
  formatChunk
};
