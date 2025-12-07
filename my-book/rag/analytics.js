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
