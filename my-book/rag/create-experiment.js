#!/usr/bin/env node

import { createExperiment } from './analytics.js';

console.log('\n🧪 Creating Your First A/B Test Experiment\n');

const experimentId = createExperiment({
  name: 'Retrieval Context Size',
  hypothesis: 'Showing 3 sources instead of 4 will improve answer quality and reduce hallucination',
  variantA: {
    description: 'Control: Show 4 sources (top-K=4)',
    change: 'TOP_K = 4',
    expectedBenefit: 'More context but potentially confusing'
  },
  variantB: {
    description: 'Test: Show 3 sources (top-K=3)',
    change: 'TOP_K = 3',
    expectedBenefit: 'Focused answers with less noise'
  },
  successMetric: 'User satisfaction rating (target: avg > 4.0/5)',
  expectedDuration: '7 days'
});

console.log('\n✅ First experiment created successfully!\n');
console.log(`📌 Experiment ID: ${experimentId}`);
console.log('\n📋 Next Steps:');
console.log('');
console.log('1️⃣  Send test requests with variant parameter:');
console.log('');
console.log('   Variant A (Control):');
console.log('   curl -X POST http://localhost:3001/api/chat \\');
console.log('     -H "Content-Type: application/json" \\');
console.log(`     -d '{"message": "What is sensor fusion?", "variant": "A", "experimentId": "${experimentId}"}'`);
console.log('');
console.log('   Variant B (Test):');
console.log('   curl -X POST http://localhost:3001/api/chat \\');
console.log('     -H "Content-Type: application/json" \\');
console.log(`     -d '{"message": "What is sensor fusion?", "variant": "B", "experimentId": "${experimentId}"}'`);
console.log('');
console.log('2️⃣  Collect at least 30 interactions per variant');
console.log('');
console.log('3️⃣  Run for 3-7 days to gather sufficient data');
console.log('');
console.log('4️⃣  View results:');
console.log('   node rag/view-analytics.js');
console.log('');
console.log('💡 Pro Tip: You can send ratings with trackInteraction() to measure user satisfaction\n');
