# 🧪 A/B Testing Guide for RAG Chatbot

Complete guide to run A/B tests on your RAG chatbot system to optimize performance, UX, and response quality.

---

## 📊 What is A/B Testing?

A/B Testing (Split Testing) compares two versions (A and B) to see which performs better.

**Examples for RAG Chatbot:**
- Test 1: Different retrieval top-K (retrieve 3 vs 4 sources)
- Test 2: Different response styles (formal vs conversational)
- Test 3: Different UI colors (purple vs blue button)
- Test 4: Different prompt templates (detailed vs concise)

---

## 🎯 A/B Testing Framework

### Step 1: Define Your Hypothesis

Write what you think will happen.

**Format:**
```
IF [Change what?]
THEN [What will improve?]
BECAUSE [Why do you think so?]
```

**Examples:**

❌ Bad: "Changing colors will make it better"

✅ Good: "IF we show top 3 sources instead of 4, THEN response quality will improve BECAUSE less context reduces hallucination"

✅ Good: "IF we use conversational tone instead of formal, THEN user satisfaction increases BECAUSE more relatable language"

### Template

```markdown
## Hypothesis: [Name]

**Variable:** [What are you changing?]
- Version A (Control): [Current state]
- Version B (Test): [New approach]

**Success Metric:** [How to measure?]
- Metric: [e.g., "User satisfaction score"]
- Target: [e.g., "80% rate it ≥4/5"]
- Current baseline: [e.g., "65%"]

**Expected outcome:** [What do you predict?]
- Confidence: [High/Medium/Low]
- Reason: [Why this will work]

**Duration:** [1-7 days typical]
**Sample size:** [e.g., "100 users" or "50 test interactions"]
```

---

## 🔧 Step-by-Step Setup

### FIRST STEP: Create Analytics Tracking

Create a new file to track A/B test results:

**File:** `rag/analytics.js`

```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ANALYTICS_FILE = path.join(__dirname, 'analytics.json');

// Initialize analytics data structure
export function initAnalytics() {
  if (!fs.existsSync(ANALYTICS_FILE)) {
    const initialData = {
      version: '1.0',
      createdAt: new Date().toISOString(),
      experiments: [],
      interactions: []
    };
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(initialData, null, 2));
    console.log('✅ Analytics initialized:', ANALYTICS_FILE);
  }
}

// Read analytics
export function getAnalytics() {
  if (!fs.existsSync(ANALYTICS_FILE)) {
    initAnalytics();
  }
  return JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf-8'));
}

// Save analytics
export function saveAnalytics(data) {
  fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2));
}

// Track interaction (user question + response)
export function trackInteraction(data) {
  const analytics = getAnalytics();
  
  const interaction = {
    id: `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    variant: data.variant || 'A', // A or B
    experimentId: data.experimentId,
    userMessage: data.userMessage,
    botResponse: data.botResponse,
    sources: data.sources || [],
    responseTime: data.responseTime, // milliseconds
    userRating: data.userRating || null, // 1-5 stars (if provided)
    metadata: data.metadata || {}
  };
  
  analytics.interactions.push(interaction);
  saveAnalytics(analytics);
  
  return interaction.id;
}

// Create experiment
export function createExperiment(config) {
  const analytics = getAnalytics();
  
  const experiment = {
    id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    name: config.name,
    hypothesis: config.hypothesis,
    variants: {
      A: config.variantA,
      B: config.variantB
    },
    successMetric: config.successMetric,
    status: 'running', // running | paused | completed
    expectedDuration: config.expectedDuration || '7 days',
    results: {
      variantA: { count: 0, ratings: [], responseTimes: [] },
      variantB: { count: 0, ratings: [], responseTimes: [] }
    }
  };
  
  analytics.experiments.push(experiment);
  saveAnalytics(analytics);
  
  console.log(`✅ Experiment created: ${experiment.name}`);
  console.log(`   ID: ${experiment.id}`);
  
  return experiment.id;
}

// Get experiment results
export function getExperimentResults(experimentId) {
  const analytics = getAnalytics();
  const experiment = analytics.experiments.find(e => e.id === experimentId);
  
  if (!experiment) {
    console.error(`❌ Experiment not found: ${experimentId}`);
    return null;
  }
  
  // Calculate stats for variant A
  const interactionsA = analytics.interactions.filter(
    i => i.experimentId === experimentId && i.variant === 'A'
  );
  
  const interactionsB = analytics.interactions.filter(
    i => i.experimentId === experimentId && i.variant === 'B'
  );
  
  const stats = {
    experiment: experiment.name,
    variantA: calculateStats(interactionsA, 'A'),
    variantB: calculateStats(interactionsB, 'B'),
    winner: determineWinner(interactionsA, interactionsB)
  };
  
  return stats;
}

// Calculate statistics
function calculateStats(interactions, variant) {
  if (interactions.length === 0) {
    return {
      variant,
      sampleSize: 0,
      avgRating: null,
      avgResponseTime: null,
      ratings: []
    };
  }
  
  const ratings = interactions
    .filter(i => i.userRating !== null)
    .map(i => i.userRating);
  
  const responseTimes = interactions.map(i => i.responseTime || 0);
  
  const avgRating = ratings.length > 0 
    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
    : null;
  
  const avgResponseTime = responseTimes.length > 0
    ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(0)
    : null;
  
  return {
    variant,
    sampleSize: interactions.length,
    ratings,
    avgRating: avgRating ? parseFloat(avgRating) : null,
    avgResponseTime: avgResponseTime ? parseInt(avgResponseTime) : null,
    ratingsCount: ratings.length
  };
}

// Determine winner
function determineWinner(interactionsA, interactionsB) {
  const statsA = calculateStats(interactionsA, 'A');
  const statsB = calculateStats(interactionsB, 'B');
  
  // If not enough data
  if (statsA.sampleSize < 10 || statsB.sampleSize < 10) {
    return {
      winner: null,
      reason: 'Not enough data (need min 10 samples per variant)'
    };
  }
  
  // If ratings available, use that
  if (statsA.avgRating && statsB.avgRating) {
    const winner = statsA.avgRating > statsB.avgRating ? 'A' : 'B';
    const diff = Math.abs(statsA.avgRating - statsB.avgRating).toFixed(2);
    
    return {
      winner,
      metric: 'avgRating',
      differencePercentage: parseFloat(diff),
      confidence: statsA.sampleSize >= 30 && statsB.sampleSize >= 30 
        ? 'High' 
        : 'Medium'
    };
  }
  
  // If response time available
  if (statsA.avgResponseTime && statsB.avgResponseTime) {
    const winner = statsA.avgResponseTime < statsB.avgResponseTime ? 'A' : 'B';
    const diff = Math.abs(statsA.avgResponseTime - statsB.avgResponseTime);
    
    return {
      winner,
      metric: 'avgResponseTime',
      difference: `${diff}ms`,
      confidence: statsA.sampleSize >= 30 && statsB.sampleSize >= 30 
        ? 'High' 
        : 'Medium'
    };
  }
  
  return { winner: null, reason: 'No comparable metrics' };
}

// Print results nicely
export function printResults(results) {
  if (!results) return;
  
  console.log('\n' + '='.repeat(60));
  console.log(`📊 A/B Test Results: ${results.experiment}`);
  console.log('='.repeat(60));
  
  console.log('\n📈 Variant A (Control):');
  console.log(`   Sample size: ${results.variantA.sampleSize}`);
  if (results.variantA.avgRating) {
    console.log(`   Avg rating: ${results.variantA.avgRating}/5 (${results.variantA.ratingsCount} ratings)`);
  }
  if (results.variantA.avgResponseTime) {
    console.log(`   Avg response time: ${results.variantA.avgResponseTime}ms`);
  }
  
  console.log('\n🆕 Variant B (Test):');
  console.log(`   Sample size: ${results.variantB.sampleSize}`);
  if (results.variantB.avgRating) {
    console.log(`   Avg rating: ${results.variantB.avgRating}/5 (${results.variantB.ratingsCount} ratings)`);
  }
  if (results.variantB.avgResponseTime) {
    console.log(`   Avg response time: ${results.variantB.avgResponseTime}ms`);
  }
  
  console.log('\n🏆 Winner: ' + (results.winner.winner || 'TBD'));
  if (results.winner.differencePercentage) {
    console.log(`   Difference: ${results.winner.differencePercentage} points`);
  }
  if (results.winner.difference) {
    console.log(`   Difference: ${results.winner.difference}`);
  }
  if (results.winner.confidence) {
    console.log(`   Confidence: ${results.winner.confidence}`);
  }
  if (results.winner.reason) {
    console.log(`   Note: ${results.winner.reason}`);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
}

// Initialize on import
initAnalytics();
```

**Save this as:** `c:\Users\PC\Desktop\spec-kit-plus\my-book\rag\analytics.js`

---

### SECOND STEP: Create Analytics Dashboard Script

**File:** `rag/view-analytics.js`

```javascript
import { getAnalytics, getExperimentResults, printResults } from './analytics.js';

console.log('\n🎯 RAG Chatbot A/B Testing Dashboard\n');

const analytics = getAnalytics();

// Show all experiments
if (analytics.experiments.length === 0) {
  console.log('📭 No experiments created yet.');
  console.log('\nTo create your first experiment, run:');
  console.log('   npm run ab:create-experiment');
  process.exit(0);
}

console.log(`📋 Active Experiments (${analytics.experiments.length}):\n`);

analytics.experiments.forEach((exp, idx) => {
  console.log(`${idx + 1}. ${exp.name}`);
  console.log(`   ID: ${exp.id}`);
  console.log(`   Status: ${exp.status}`);
  console.log(`   Created: ${new Date(exp.createdAt).toLocaleDateString()}`);
  
  const results = getExperimentResults(exp.id);
  if (results) {
    console.log(`   Variant A: ${results.variantA.sampleSize} interactions`);
    console.log(`   Variant B: ${results.variantB.sampleSize} interactions`);
    if (results.winner.winner) {
      console.log(`   Winner: Variant ${results.winner.winner}`);
    }
  }
  console.log();
});

// Show latest results
console.log('📊 Latest Results:\n');
const latestExp = analytics.experiments[analytics.experiments.length - 1];
if (latestExp) {
  const results = getExperimentResults(latestExp.id);
  printResults(results);
}

console.log('💡 To view results for a specific experiment:');
console.log('   npm run ab:view-results <experiment-id>');
```

**Save this as:** `c:\Users\PC\Desktop\spec-kit-plus\my-book\rag\view-analytics.js`

---

### THIRD STEP: Integrate Analytics into Server

**Update:** `c:\Users\PC\Desktop\spec-kit-plus\my-book\rag\server.js`

Add these lines at the top (after existing imports):

```javascript
import { trackInteraction } from './analytics.js';
```

Then modify the `/api/chat` endpoint to track interactions. Find this section:

```javascript
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  // ... existing code ...
  res.json({ reply, sources });
});
```

Replace with:

```javascript
app.post('/api/chat', async (req, res) => {
  const startTime = Date.now();
  const { message, variant = 'A', experimentId = null } = req.body;
  
  try {
    // ... existing retrieval and generation code ...
    const reply = await generateResponse(query, context);
    
    // Track the interaction
    const responseTime = Date.now() - startTime;
    trackInteraction({
      variant: variant,
      experimentId: experimentId,
      userMessage: message,
      botResponse: reply,
      sources: sources.map(s => ({ title: s.title, section: s.section })),
      responseTime: responseTime
    });
    
    res.json({ reply, sources });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});
```

---

### FOURTH STEP: Add NPM Scripts

**Update:** `c:\Users\PC\Desktop\spec-kit-plus\my-book\package.json`

Add these scripts to the `"scripts"` section:

```json
"ab:view": "node rag/view-analytics.js",
"ab:create": "node rag/analytics.js"
```

---

## 🚀 Your First A/B Test

### Create First Experiment

Create a file: `test-experiment.js`

```javascript
import { createExperiment } from './rag/analytics.js';

const experimentId = createExperiment({
  name: 'Retrieval Context Size',
  hypothesis: 'Showing 3 sources instead of 4 will improve answer quality',
  variantA: {
    description: 'Control: Show 4 sources',
    change: 'TOP_K = 4'
  },
  variantB: {
    description: 'Test: Show 3 sources',
    change: 'TOP_K = 3'
  },
  successMetric: 'User satisfaction rating (avg > 4.0/5)',
  expectedDuration: '7 days'
});

console.log(`\n✅ Experiment created! ID: ${experimentId}`);
console.log('\nNext steps:');
console.log('1. Start using variant A and B with real users');
console.log('2. Collect ratings from users (1-5 stars)');
console.log('3. View results: npm run ab:view');
```

Run:
```bash
node test-experiment.js
```

---

## 📊 Simple A/B Test Examples

### Test 1: Response Formality

```javascript
// Hypothesis: Conversational tone gets better ratings than formal

createExperiment({
  name: 'Response Tone Test',
  hypothesis: 'Conversational responses get higher satisfaction',
  variantA: { description: 'Formal tone', change: 'Use professional language' },
  variantB: { description: 'Conversational tone', change: 'Use friendly language' },
  successMetric: 'User satisfaction (≥4/5)',
  expectedDuration: '7 days'
});
```

### Test 2: Button Color

```javascript
// Hypothesis: Different color attracts more clicks

createExperiment({
  name: 'Chat Button Color',
  hypothesis: 'Purple button gets more clicks than blue',
  variantA: { description: 'Purple button', change: '#667eea' },
  variantB: { description: 'Blue button', change: '#4289F4' },
  successMetric: 'Click-through rate',
  expectedDuration: '3 days'
});
```

### Test 3: Response Length

```javascript
// Hypothesis: Shorter responses are clearer

createExperiment({
  name: 'Response Length Test',
  hypothesis: 'Concise answers (150 words) beat verbose (300+ words)',
  variantA: { description: 'Detailed answer', change: 'max_length = 300' },
  variantB: { description: 'Concise answer', change: 'max_length = 150' },
  successMetric: 'User satisfaction rating',
  expectedDuration: '7 days'
});
```

---

## 📈 How to Run Your First Test (Manual)

### Step 1: Initialize Analytics
```bash
npm run ab:view
```
This shows current experiments.

### Step 2: Create Experiment
```bash
node test-experiment.js
```
This creates your first experiment and gives you an ID.

### Step 3: Send Requests with Variants

**Variant A (Control):**
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is sensor fusion?",
    "variant": "A",
    "experimentId": "exp_YOUR_ID_HERE"
  }'
```

**Variant B (Test):**
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is sensor fusion?",
    "variant": "B",
    "experimentId": "exp_YOUR_ID_HERE"
  }'
```

### Step 4: View Results
```bash
npm run ab:view
```

---

## ⭐ Adding User Ratings

Users can rate responses. Add to chat component:

```javascript
// After receiving response
const userRating = prompt('Rate this response (1-5):');

if (userRating) {
  fetch('http://localhost:3001/api/rate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      experimentId: currentExperiment,
      variant: currentVariant,
      rating: parseInt(userRating)
    })
  });
}
```

---

## 🎯 Success Criteria Checklist

For your first A/B test to be valid:

- [ ] Clear hypothesis written
- [ ] At least 30 interactions per variant
- [ ] At least 15 ratings collected per variant
- [ ] Test runs for minimum 3-7 days
- [ ] Statistical difference > 5% to be significant
- [ ] Confidence level = "High" (30+ samples)

---

## 📋 Sample Test Results

**Example Output:**

```
============================================================
📊 A/B Test Results: Retrieval Context Size
============================================================

📈 Variant A (Control):
   Sample size: 45
   Avg rating: 4.1/5 (40 ratings)
   Avg response time: 487ms

🆕 Variant B (Test):
   Sample size: 48
   Avg rating: 4.3/5 (42 ratings)
   Avg response time: 423ms

🏆 Winner: Variant B
   Difference: 0.2 points
   Confidence: High

============================================================
```

---

## ⚠️ Common Mistakes to Avoid

❌ **Too short test duration** → Run at least 3-7 days
❌ **Biased variant selection** → Alternate randomly
❌ **Too few samples** → Need 30+ per variant
❌ **Changing test mid-way** → Lock hypothesis first
❌ **One success metric** → Use multiple signals
❌ **Not tracking context** → Save query, response, metadata

---

## 🔄 Next Steps After First Test

1. ✅ Complete first A/B test
2. ✅ Document results
3. ✅ Deploy winning variant
4. ✅ Start next test
5. ✅ Build continuous testing culture

---

**Version:** 1.0  
**Status:** Ready to use  
**Next:** Run your first experiment! 🚀
