#!/usr/bin/env node

/**
 * Complete A/B Testing Example
 * 
 * This file demonstrates how to:
 * 1. Create an experiment
 * 2. Track interactions
 * 3. View results
 * 4. Determine winner
 * 
 * Run: node rag/example-ab-test.js
 */

import { 
  createExperiment, 
  trackInteraction, 
  getExperimentResults, 
  printResults,
  getAnalytics
} from './analytics.js';

console.log('\n' + '='.repeat(60));
console.log('🧪 Complete A/B Testing Example');
console.log('='.repeat(60) + '\n');

// ============================================================
// STEP 1: Create an Experiment
// ============================================================

console.log('📝 Step 1: Creating Experiment...\n');

const experimentId = createExperiment({
  name: 'Response Latency Optimization',
  hypothesis: 'Optimized search algorithm will reduce response time by 20%',
  variantA: {
    description: 'Original algorithm (O(n) search)',
    change: 'Current implementation',
    expectedLatency: '450-500ms'
  },
  variantB: {
    description: 'Optimized algorithm (indexed search)',
    change: 'New implementation',
    expectedLatency: '350-400ms'
  },
  successMetric: 'Average response time < 400ms',
  expectedDuration: '7 days'
});

console.log(`✅ Experiment created: ${experimentId}\n`);

// ============================================================
// STEP 2: Simulate Real User Interactions
// ============================================================

console.log('📊 Step 2: Recording Interactions...\n');

const testQuestions = [
  'What is sensor fusion?',
  'How do robots perceive the environment?',
  'Explain prompt engineering techniques',
  'What is reinforcement learning?',
  'How does computer vision work?',
  'What is natural language processing?',
  'Explain convolutional neural networks',
  'What is an attention mechanism?'
];

// Variant A: Slower responses (original implementation)
console.log('   Recording Variant A interactions...');
for (let i = 0; i < 25; i++) {
  const question = testQuestions[i % testQuestions.length];
  const responseTime = 450 + Math.random() * 100; // 450-550ms
  const userRating = Math.random() > 0.3 ? Math.floor(Math.random() * 2) + 4 : Math.floor(Math.random() * 3) + 2; // Mostly 4-5
  
  trackInteraction({
    variant: 'A',
    experimentId: experimentId,
    userMessage: question,
    botResponse: 'Answer about ' + question.toLowerCase(),
    sources: [
      { title: 'Chapter 1', section: 'intro' },
      { title: 'Chapter 2', section: 'advanced' }
    ],
    responseTime: responseTime,
    userRating: userRating,
    metadata: { batchId: 'batch_1', testRun: true }
  });
}

// Variant B: Faster responses (optimized implementation)
console.log('   Recording Variant B interactions...');
for (let i = 0; i < 28; i++) {
  const question = testQuestions[i % testQuestions.length];
  const responseTime = 350 + Math.random() * 80; // 350-430ms (faster)
  const userRating = Math.random() > 0.2 ? Math.floor(Math.random() * 2) + 4 : Math.floor(Math.random() * 3) + 3; // Mostly 4-5, better
  
  trackInteraction({
    variant: 'B',
    experimentId: experimentId,
    userMessage: question,
    botResponse: 'Answer about ' + question.toLowerCase(),
    sources: [
      { title: 'Chapter 1', section: 'intro' },
      { title: 'Chapter 2', section: 'advanced' }
    ],
    responseTime: responseTime,
    userRating: userRating,
    metadata: { batchId: 'batch_1', testRun: true }
  });
}

console.log('✅ 53 interactions recorded\n');

// ============================================================
// STEP 3: Analyze Results
// ============================================================

console.log('📈 Step 3: Analyzing Results...\n');

const results = getExperimentResults(experimentId);
printResults(results);

// ============================================================
// STEP 4: Detailed Analysis
// ============================================================

console.log('\n📊 DETAILED ANALYSIS\n');

console.log('🔍 Response Time Comparison:');
console.log(`   Variant A: ${results.variantA.avgResponseTime}ms`);
console.log(`   Variant B: ${results.variantB.avgResponseTime}ms`);

const timeDiff = results.variantA.avgResponseTime - results.variantB.avgResponseTime;
const timePercent = ((timeDiff / results.variantA.avgResponseTime) * 100).toFixed(1);
console.log(`   Improvement: ${timeDiff}ms (${timePercent}% faster)\n`);

console.log('⭐ User Satisfaction (Rating):');
if (results.variantA.avgRating && results.variantB.avgRating) {
  console.log(`   Variant A: ${results.variantA.avgRating}/5 (${results.variantA.ratingsCount} ratings)`);
  console.log(`   Variant B: ${results.variantB.avgRating}/5 (${results.variantB.ratingsCount} ratings)`);
  
  const ratingDiff = (results.variantB.avgRating - results.variantA.avgRating).toFixed(2);
  console.log(`   Difference: ${ratingDiff} points\n`);
}

console.log('📋 Sample Size:');
console.log(`   Variant A: ${results.variantA.sampleSize} interactions`);
console.log(`   Variant B: ${results.variantB.sampleSize} interactions`);
console.log(`   Total: ${results.variantA.sampleSize + results.variantB.sampleSize}\n`);

// ============================================================
// STEP 5: Recommendation
// ============================================================

console.log('🎯 RECOMMENDATION\n');

if (results.winner.winner) {
  console.log(`✅ Winner: Variant ${results.winner.winner}`);
  console.log(`   Confidence: ${results.winner.confidence}`);
  
  if (results.winner.winner === 'B') {
    console.log(`\n📌 Action: Deploy Variant B (optimized algorithm)`);
    console.log('   - Better response time');
    console.log('   - Higher user satisfaction');
    console.log('   - Ready for production');
  } else {
    console.log(`\n📌 Action: Keep Variant A (current implementation)`);
    console.log('   - No significant improvement');
    console.log('   - Continue monitoring');
  }
} else {
  console.log('⏳ Not enough data yet');
  console.log('   Continue collecting interactions...');
}

console.log('\n' + '='.repeat(60));
console.log('✨ Example Complete!');
console.log('='.repeat(60) + '\n');

// ============================================================
// NEXT STEPS
// ============================================================

console.log('📋 NEXT STEPS:\n');
console.log('1. Review the results above');
console.log('2. Make a decision based on confidence level');
console.log('3. If confident: deploy winning variant');
console.log('4. If not enough data: continue collecting interactions');
console.log('5. View results anytime:');
console.log('   node rag/view-analytics.js\n');

// ============================================================
// View raw analytics
// ============================================================

console.log('💾 RAW DATA:\n');
const analytics = getAnalytics();
const exp = analytics.experiments.find(e => e.id === experimentId);
console.log(`Experiment Details:`);
console.log(`  Name: ${exp.name}`);
console.log(`  Created: ${exp.createdAt}`);
console.log(`  Status: ${exp.status}`);
console.log(`  Success Metric: ${exp.successMetric}\n`);
