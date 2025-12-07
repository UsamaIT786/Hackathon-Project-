# RAG Backend - Complete Setup

This directory contains a production-ready RAG (Retrieval-Augmented Generation) backend built with pure ESM modules, Express, and Xenova Transformers.

## 📁 Files

### `ingest.mjs`
**Purpose**: Read and process documentation files

- Recursively scans `./docs/` for all `.md` and `.mdx` files
- Cleans markdown (removes front matter, code blocks, comments)
- Splits content into chunks (~500 words each)
- Saves metadata to `chunks.json`

**Output**: `chunks.json` containing:
```json
[
  {
    "text": "chunk content...",
    "source": "relative/path/to/file.md",
    "length": 234
  }
]
```

### `embed.mjs`
**Purpose**: Generate embeddings for all chunks

- Loads chunks from `chunks.json`
- Uses **Xenova/all-MiniLM-L6-v2** model (384-dim vectors)
- Processes in batches of 32 for efficiency
- Normalizes vectors for cosine similarity
- Saves embeddings to `embeddings.json`

**Output**: `embeddings.json` containing:
```json
[
  {
    "id": 0,
    "text": "chunk content...",
    "source": "path/to/file.md",
    "vector": [0.123, -0.456, ...],
    "length": 234
  }
]
```

### `server.mjs`
**Purpose**: Express API for semantic search

- Loads embeddings and model on startup
- Implements cosine similarity search
- Returns top 3 most relevant chunks per query
- Provides health/stats endpoints

**API Endpoints**:
- `GET /health` - Server status
- `POST /api/rag` - Semantic search
- `GET /api/stats` - Statistics

## 🚀 Quick Start

### 1. Install Dependencies (if not already done)

```bash
npm install
```

**Required packages**:
- `@xenova/transformers` - Embedding model
- `express` - Web framework
- `cors` - Cross-origin support

### 2. Run the Pipeline

#### Option A: Run all steps at once
```bash
npm run rag:all
```

#### Option B: Run individually
```bash
# Step 1: Ingest documentation
npm run rag:ingest

# Step 2: Generate embeddings (takes 2-5 minutes on first run)
npm run rag:embed

# Step 3: Start the server
npm run rag:serve
```

## 📊 Example Usage

### Using cURL

```bash
curl -X POST http://localhost:5050/api/rag \
  -H "Content-Type: application/json" \
  -d '{"query": "How do I install this project?"}'
```

### Using Node.js

```javascript
const response = await fetch('http://localhost:5050/api/rag', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'your search query' })
});

const data = await response.json();
console.log(data);
```

### Response Format

```json
{
  "query": "How do I install this project?",
  "results": [
    {
      "text": "First chunk of relevant text...",
      "source": "docs/installation.md",
      "score": 0.8234
    },
    {
      "text": "Second chunk of relevant text...",
      "source": "docs/quickstart.md",
      "score": 0.7612
    },
    {
      "text": "Third chunk of relevant text...",
      "source": "docs/setup.md",
      "score": 0.7234
    }
  ],
  "timestamp": "2025-12-07T12:34:56.789Z"
}
```

## 🔧 Configuration

Edit these constants in the `.mjs` files to customize:

**ingest.mjs**:
- `CHUNK_SIZE` (line 86) - Words per chunk (default: 500)

**embed.mjs**:
- `BATCH_SIZE` (line 14) - Embeddings per batch (default: 32)
- `MODEL_NAME` (line 13) - Model to use

**server.mjs**:
- `PORT` (line 15) - Server port (default: 5050)
- `TOP_K` (line 16) - Results to return (default: 3)
- `MODEL_NAME` (line 17) - Model to use

## 📈 Performance Notes

### First Run
- **Ingest**: ~1-2 seconds (depends on doc size)
- **Embed**: 2-5 minutes (downloads model, ~100MB)
- **Server startup**: ~5-10 seconds

### Subsequent Runs
- Model is cached, startup is much faster
- Embeddings are reused unless docs change

### Memory Usage
- Model: ~150MB RAM
- Embeddings: ~100MB per 1000 chunks (roughly)

## 🧹 Cleanup

To remove generated files and reset:

```bash
# Remove chunks
rm rag/chunks.json

# Remove embeddings
rm rag/embeddings.json

# Model cache is in ~/.cache/huggingface
# (Xenova stores it there automatically)
```

## 🐛 Troubleshooting

### "No markdown files found"
- Ensure `./docs/` directory exists
- Check that files are `.md` or `.mdx` extension

### Model download fails
- Check internet connection
- Verify Node.js version >= 16.14
- Try clearing cache: `rm -rf ~/.cache/huggingface`

### Out of memory during embedding
- Reduce `BATCH_SIZE` in `embed.mjs` (line 14)
- Try: `BATCH_SIZE: 8` or `BATCH_SIZE: 16`

### "No embeddings loaded" error
- Run `npm run rag:embed` first
- Ensure `rag/embeddings.json` exists

## 🛠️ Implementation Details

### Chunking Strategy
Text is split by word count (~500 words) to create semantically meaningful chunks while maintaining context.

### Embeddings
- **Model**: Xenova/all-MiniLM-L6-v2
- **Dimensions**: 384
- **Pooling**: Mean pooling with L2 normalization
- **Speed**: ~1000 embeddings/second on CPU

### Search Algorithm
1. Embed the query using same model
2. Compute cosine similarity to all stored vectors
3. Return top 3 by similarity score
4. Similarity range: 0.0 (no match) to 1.0 (perfect match)

### Cosine Similarity
```
similarity = (A · B) / (||A|| × ||B||)
```
Where A is the query vector and B is a chunk vector.

## 📝 ESM Notes

All files use native ES modules (`.mjs`):
- `import` statements (not `require()`)
- `async/await` throughout
- Works with Node.js 16.14+
- Native support for top-level await

## 📄 License

Same as parent project

---

**Ready to use!** Run `npm run rag:all` to get started.
