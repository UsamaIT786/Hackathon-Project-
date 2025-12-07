import { getAnalytics, getExperimentResults, printResults } from './analytics.js';

console.log('\n🎯 RAG Chatbot A/B Testing Dashboard\n');

const analytics = getAnalytics();

// Show all experiments
if (analytics.experiments.length === 0) {
  console.log('📭 No experiments created yet.');
  console.log('\nTo create your first experiment, run:');
  console.log('   node rag/create-experiment.js');
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
console.log('   npm run ab:view <experiment-id>');
