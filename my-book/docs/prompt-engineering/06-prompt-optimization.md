---
title: "Prompt Optimization and Tuning"
description: "Systematically improve prompts for better results."
keywords:
  - "optimization"
  - "tuning"
  - "evaluation"
  - "iteration"
---

# Prompt Optimization and Tuning

## Overview

Crafting perfect prompts is rarely a first-try achievement. This chapter covers systematic approaches to evaluate and improve prompts, moving from heuristics to data-driven optimization.

## Evaluation Methods

### Method 1: Manual Inspection

Most basic approach - read outputs and evaluate:

```
Prompt v1 output: ✓ Good
Prompt v2 output: ✗ Missing detail  
Prompt v3 output: ✓ Better than v1

Next: Try to understand why v3 works better
```

**Pros:** Quick, intuitive
**Cons:** Subjective, doesn't scale

### Method 2: Automated Scoring

Use secondary model to evaluate:

```python
def evaluate_output(prompt, output):
    evaluation_prompt = f"""
    Evaluate this output on a scale of 1-10:
    - Does it answer the question?
    - Is it accurate?
    - Is it well-formatted?
    
    Output to evaluate:
    {output}
    
    Score: [1-10]
    Reason: [explanation]
    """
    
    score = get_score_from_model(evaluation_prompt)
    return score

# Test multiple prompts
scores = {}
for prompt_version in all_prompts:
    output = model.query(prompt_version)
    score = evaluate_output(prompt_version, output)
    scores[prompt_version] = score

# Find best
best_prompt = max(scores, key=scores.get)
```

### Method 3: Test Set Evaluation

Compare prompts on curated examples:

```
Test set (20 examples with known good answers):
1. Input: "What's 2+2?"
   Expected: "4"

2. Input: "What's the capital of France?"
   Expected: "Paris"

... (18 more examples)

For each prompt:
  accuracy = (correct answers) / (total)
  
Compare:
Prompt A: 18/20 = 90%
Prompt B: 19/20 = 95%
Prompt C: 17/20 = 85%

Best: Prompt B
```

## Iteration Strategy

### Iterate on Specific Dimensions

Rather than rewriting completely, adjust one aspect:

```
Base prompt:
"Classify sentiment: positive, negative, neutral"

Iteration 1 (add role):
"You are a sentiment analyst.
 Classify sentiment: positive, negative, neutral"

Iteration 2 (add examples):
"You are a sentiment analyst.
 Classify sentiment.
 Examples:
 - 'Great!' → positive
 - 'Bad' → negative
 NOW: 'It's okay' → ?"

Iteration 3 (add confidence):
"You are a sentiment analyst.
 Classify sentiment with confidence (0-100).
 Examples: ...
 NOW: 'It's okay' → [sentiment, confidence]"
```

Track which changes help.

### A/B Testing Prompts

Formally compare two prompts:

```
Prompt A (current):
"Summarize this article in one sentence"

Prompt B (experimental):
"You are a journalist. 
 Summarize this article in one sentence.
 Focus on the main finding."

Test on 50 articles:
- Prompt A: Average rating 7.2/10
- Prompt B: Average rating 7.8/10

Result: Prompt B is 0.6 points better
Decision: Adopt Prompt B
```

## Optimizing Parameters

### Temperature Tuning

```
Task: Classify bugs as critical/major/minor

Temperature 0.0 (deterministic):
- Consistent classifications
- Conservative (mostly "major")
- Good for safety-critical systems

Temperature 0.7 (moderate):
- Balanced
- Reasonable variation
- Good default

Temperature 1.0+ (creative):
- Varied classifications
- More nuanced decisions
- Better for thoughtful analysis

Test on 100 examples, measure accuracy:
Temp 0.0: 82% accuracy (too conservative)
Temp 0.5: 85% accuracy (good)
Temp 0.7: 84% accuracy (similar to 0.5)
Temp 1.0: 80% accuracy (less consistent)

Choose: Temperature 0.5
```

### Max Tokens Tuning

```
Task: Generate product description

Max tokens 50:  Too short, missing details
Max tokens 100: Good balance
Max tokens 200: More details, some redundancy
Max tokens 500: Verbose, repetitive

Choose: Max tokens 100
```

### Top-K and Top-P Settings

```
Top-K (consider top K most likely tokens):
- Top-K=1: Only most likely (rigid)
- Top-K=10: Some diversity
- Top-K=100: High diversity

Top-P (probability threshold):
- Top-P=0.9: Conservative
- Top-P=0.99: Diverse
```

Tune together with temperature and measure results.

## Prompt Engineering Frameworks

### Framework 1: CLEAR

```
C - Context: Set the stage
L - Large examples: Provide examples
E - Execute: Ask for output  
A - Analyze: Request analysis
R - Refine: Ask for improvements
```

### Framework 2: SCRATCHPAD

```
S - System prompt: Define role
C - Context: Provide background
R - Request: State desired output
A - Add: Include examples
T - Track: Request intermediate steps
C - Check: Ask for verification
H - Hints: Provide constraints
P - Parameters: Specify format
A - Auto-improve: Request self-critique
D - Deliver: Ask for final answer
```

### Framework 3: The Prompt Template

```
ROLE: [Who should model be?]

CONTEXT: [Background information]

TASK: [Specific request]

CONSTRAINTS: [What to avoid/include]

EXAMPLES:
  Example 1: [in/out]
  Example 2: [in/out]

FORMAT: [Output structure]

Now, [actual task]
```

## Data-Driven Optimization

### Automated Prompt Search

Use algorithms to find good prompts:

```python
from itertools import product

# Define variables to test
roles = ["assistant", "expert", "researcher"]
examples_count = [0, 2, 5]
formats = ["paragraph", "list", "JSON"]

best_score = 0
best_config = None

# Test all combinations
for role, ex_count, fmt in product(roles, 
                                    examples_count, 
                                    formats):
    prompt = build_prompt(role, ex_count, fmt)
    score = evaluate_on_test_set(prompt)
    
    if score > best_score:
        best_score = score
        best_config = (role, ex_count, fmt)

print(f"Best: Role={best_config[0]}, "
      f"Examples={best_config[1]}, "
      f"Format={best_config[2]}")
```

### Gradient-Based Optimization

Some researchers use gradients to optimize prompts:

```
Start: Random prompt embedding
Goal: Optimize embedding to maximize score

Process:
1. Embed current prompt
2. Evaluate score
3. Compute gradient (how to change embedding 
   to improve score)
4. Move in gradient direction
5. Repeat until convergence

Result: Optimized prompt found automatically
```

## When to Stop Iterating

```
Metric: Accuracy on test set
Target: 90%

Iteration 1: 75% → Big improvement (+15)
Iteration 2: 82% → Good improvement (+7)
Iteration 3: 87% → Decent improvement (+5)
Iteration 4: 88% → Small improvement (+1)
Iteration 5: 88% → No improvement (0)

Return of diminishing returns around iteration 3-4
Decision: Stop iterating, deploy at iteration 4
```

## Production Considerations

### Versioning Prompts

```
prompts/
├── sentiment-v1.txt
├── sentiment-v2.txt
├── sentiment-v3.txt (current)
└── sentiment-v3-backup.txt

Track:
- When each version deployed
- Performance metrics per version
- Why changes were made
- Rollback procedure if needed
```

### Monitoring Prompt Performance

```python
# Log performance over time
performance_log = []

for batch in data_stream:
    output = model.query(prompt_v3, batch)
    accuracy = evaluate(output)
    
    performance_log.append({
        "timestamp": now(),
        "accuracy": accuracy,
        "prompt_version": "v3",
        "batch_size": len(batch)
    })

# Alert if performance degrades
if accuracy < 0.85:
    alert("Prompt performance degraded!")
    # Could trigger reoptimization
```

## Summary

Prompt optimization requires:

1. **Measurement**: Use test sets and scoring
2. **Iteration**: Systematic testing of variations
3. **Comparison**: A/B testing to compare approaches
4. **Tuning**: Optimize temperature, tokens, parameters
5. **Automation**: Use algorithms for large-scale optimization
6. **Monitoring**: Track performance in production

The best prompts come from rigorous evaluation and continuous refinement, not guesswork.

---

**Previous:** [Function Calling and Tool Use](./05-function-calling.md) | **Next:** [Multi-Modal Prompting](./07-multimodal-prompting.md)
