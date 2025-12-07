---
title: "Few-Shot Learning and Examples"
description: "Master the power of learning from examples in language models."
keywords:
  - "few-shot learning"
  - "examples"
  - "in-context learning"
  - "demonstrations"
---

# Few-Shot Learning and Examples

## Overview

One of the most powerful capabilities of modern language models is "in-context learning": learning from examples provided in the prompt without any parameter updates. This chapter explores how to effectively use few-shot learning to teach models new tasks.

## Key Concepts

- **Few-shot learning**: Learning from handful of examples
- **Zero-shot**: No examples, just instruction
- **One-shot**: Single example provided
- **Few-shot**: Multiple examples (typically 2-10)
- **Example quality**: Better examples → better results
- **Example ordering**: Order affects learning
- **Diverse examples**: Cover edge cases

## Why Few-Shot Works

Language models have learned patterns from massive text corpora. Few-shot learning leverages this:

```
Model knowledge base (from training):
├─ English grammar and vocabulary
├─ Common patterns and reasoning
├─ Relationships between concepts
├─ Many real-world examples
└─ (Massive pattern library)

Few-shot prompt:
├─ Example 1: Task instance
├─ Example 2: Task instance
├─ Example 3: Task instance
└─ Implicit: "Apply this pattern to new case"

Model reasoning:
"I see pattern in these examples
 → Apply pattern to new input
 → Generate output"
```

## Zero-Shot vs. Few-Shot vs. Fine-Tuning

```
ZERO-SHOT:
- Cost: Free (no examples needed)
- Quality: Often good, sometimes poor
- Use: Simple, straightforward tasks
Example: "Translate to Spanish: hello"

FEW-SHOT:
- Cost: Low (few examples)
- Quality: Usually good
- Use: Custom tasks, specialized formats
Example: "Translate keeping formality..."
         [3 examples]
         "Now translate: hello"

FINE-TUNING:
- Cost: High (many examples, compute)
- Quality: Best for specific tasks
- Use: Repeated use, critical accuracy
Example: "Train model on 1000+ examples"
```

## Designing Good Examples

### Example 1: Clear Input-Output Pairs

```
❌ Unclear:
"Example 1: The quick brown fox → fast"
(What's the rule?)

✅ Clear:
"Example 1: 
Input: The quick brown fox jumps
Output: An adjective is 'quick'"
(Input and output roles clear)
```

### Example 2: Diversity Matters

```
❌ Poor diversity:
Example 1: "Run → Present: running"
Example 2: "Walk → Present: walking"
Example 3: "Jump → Present: jumping"
(All regular past→present)

✅ Good diversity:
Example 1: "Run → Present: running" (regular)
Example 2: "Be → Present: being" (irregular)
Example 3: "Go → Present: going" (irregular)
(Covers different patterns)
```

### Example 3: Edge Cases

```
❌ Missing edge cases:
"Classify sentiment:"
Example 1: "Love it!" → Positive
Example 2: "Hate it!" → Negative
(No neutral or sarcasm)

✅ Including edge cases:
Example 1: "Love it!" → Positive
Example 2: "Hate it!" → Negative
Example 3: "It's okay" → Neutral
Example 4: "Yeah right, best ever" → Sarcasm (Negative)
```

## Example Ordering and Positioning

The position and order of examples matters:

### Order Effect

```
SCENARIO 1: Easy examples first
Example 1 (easy): "A + B = ?" → 5
Example 2 (hard): "The integral of x² from 0 to 1?" → 1/3
Example 3 (hard): "Prove P=NP" → (Unsolvable)

Result: Model sees easy pattern, 
        then struggles with hard

SCENARIO 2: Hard example first
Example 1 (hard): "The integral of x² from 0 to 1?" → 1/3
Example 2 (hard): "Prove P=NP" → (Unsolvable)
Example 3 (easy): "A + B = ?" → 5

Result: Model learns hard pattern first,
        applies it to new task
```

Usually: Start with easier examples to establish pattern, include harder ones.

### Position Effect (Recency Bias)

Models sometimes weight recent examples more heavily:

```
Pattern: Recent examples more influential

Position 1 (far): Example of format A
Position 2: Example of format B
Position 3: Example of format C
Position 4 (recent): Example of format C

Model might: Over-apply format C 
            since it's most recent

Solution: Put your most important example near end
```

## Few-Shot Example: Sentiment Analysis

### Version 1: Without Examples (Zero-Shot)

```
PROMPT:
"Classify sentiment as positive, negative, or neutral.
Input: This movie was terrible
Output: ?"

MODEL RESPONSE:
"negative"

ACCURACY: Usually correct, but can be ambiguous
PROBLEM: What about sarcasm? Subtle sentiment?
```

### Version 2: With Examples (Few-Shot)

```
PROMPT:
"Classify sentiment. Explain your reasoning.

EXAMPLES:
1) Input: "I love this!"
   Confidence: 0.95
   Output: Positive
   Reason: "love" is strong positive indicator

2) Input: "It's okay, not great"
   Confidence: 0.7
   Output: Neutral
   Reason: Balanced positive and critical elements

3) Input: "Waste of time"
   Confidence: 0.9
   Output: Negative
   Reason: "waste" indicates negative judgment

NOW CLASSIFY:
Input: "This movie was terrible"
Output: ?"

MODEL RESPONSE:
"Output: Negative
 Confidence: 0.95
 Reason: 'terrible' is strong negative indicator 
         expressing disapproval"
```

**Result**: More consistent, includes reasoning and confidence

## Few-Shot for Custom Formats

Teaching a model a custom output format:

### Example: Extracting Entity Information

```
TASK: Extract people and their roles from text

EXAMPLES:
1) Text: "Alice, a doctor, met Bob, an engineer"
   Output: 
   {
     "people": [
       {"name": "Alice", "role": "doctor"},
       {"name": "Bob", "role": "engineer"}
     ]
   }

2) Text: "CEO John approved the project with manager Sarah"
   Output:
   {
     "people": [
       {"name": "John", "role": "CEO"},
       {"name": "Sarah", "role": "manager"}
     ]
   }

NOW EXTRACT:
Text: "Dr. Chen, a researcher, collaborated with 
       Professor Lee, an advisor"
Output: ?
```

The model learns from examples that you want:
- JSON format
- People array with name and role
- Specific key names

## Few-Shot Prompt Template

```
TASK DESCRIPTION:
[What you want done]

IMPORTANT RULES:
[Key constraints or instructions]

EXAMPLES:

Example 1:
Input: [example input 1]
Output: [example output 1]

Example 2:
Input: [example input 2]
Output: [example output 2]

Example 3:
Input: [example input 3]
Output: [example output 3]

NEW TASK:
Input: [your actual input]
Output: ?
```

## Computational Efficiency of Few-Shot

```
Token usage:
Zero-shot: Task + Input = ~50 tokens
Few-shot (3 examples): Task + 3×30 + Input = ~200 tokens
Fine-tuned: No task in prompt = just input

Cost difference:
Zero-shot: Fast, cheap, but lower quality
Few-shot: Slower, more expensive, better quality
Fine-tuned: Fast (after training cost), best quality

When to use:
├─ Zero-shot: Speed critical, quality acceptable
├─ Few-shot: Balance of quality and cost
└─ Fine-tuned: Quality critical, repeated use
```

## Advanced: Dynamic Few-Shot Selection

Instead of fixed examples, choose examples based on input:

```
Algorithm:
1. Receive new input
2. Search training examples for similar ones
3. Select most relevant examples
4. Build prompt with those examples
5. Query model

Benefit: Personalized examples for each input
Result: Better performance than fixed examples
```

## Few-Shot for Code Generation

```
TASK: Write function to solve problem

EXAMPLES:

Example 1:
Problem: Sum all even numbers in list
Input: [1, 2, 3, 4, 5, 6]
Output:
```python
def sum_evens(items):
    return sum(x for x in items if x % 2 == 0)
```

Example 2:
Problem: Count occurrences of each word
Input: ["apple", "banana", "apple"]
Output:
```python
def count_words(words):
    counts = {}
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    return counts
```

PROBLEM: Find maximum value and its index
Input: [3, 7, 2, 9, 1]
Output: ?
```

The model learns:
- Function definition syntax
- Approach to problem solving
- Code style and patterns

## Summary

Few-shot learning is powerful because:

1. **Effective teaching**: Examples teach patterns better than explanations
2. **Flexible**: Works for any task with examples
3. **Cost-efficient**: No fine-tuning needed
4. **Transparent**: You control what's taught via examples
5. **Adaptable**: Can change examples per use case

The key to good few-shot prompting is thoughtful example selection with diversity, clarity, and edge case coverage.

---

**Previous:** [Advanced Prompting Techniques](./02-advanced-techniques.md) | **Next:** [Chain-of-Thought Reasoning](./04-chain-of-thought.md)
