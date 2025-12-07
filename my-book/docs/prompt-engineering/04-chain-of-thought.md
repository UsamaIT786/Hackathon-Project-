---
title: "Chain-of-Thought and Reasoning"
description: "Leverage structured reasoning to improve model outputs."
keywords:
  - "chain of thought"
  - "reasoning"
  - "step by step"
  - "problem solving"
---

# Chain-of-Thought and Reasoning

## Overview

Chain-of-Thought (CoT) prompting dramatically improves model performance on complex tasks by explicitly asking models to show their reasoning step-by-step. Rather than jumping to conclusions, CoT breaks problems into manageable pieces.

## How Chain-of-Thought Works

### Direct vs. CoT Approach

```
DIRECT (No reasoning shown):
Q: If Sarah has 3 apples, Bob gives her 2,
   and she gives 1 to Carol, how many does
   Sarah have?
A: 4

CoT (Shows reasoning):
Q: Let's work through this step by step.
   1. How many apples does Sarah start with?
   2. How many does Bob give her?
   3. How many does she give away?
   4. Final count?
A:
   1. Sarah starts with 3 apples
   2. Bob gives her 2, so 3 + 2 = 5
   3. She gives 1 to Carol, so 5 - 1 = 4
   4. Sarah has 4 apples
```

**Why CoT works better:**
- Breaks problem into steps
- Each step easier to get right
- Errors compound less
- You can verify intermediate steps

## Implementing Chain-of-Thought

### Basic Template

```
TASK: [Your question]

Let's think step by step:
1. [First key point]
2. [Second key point]
3. [Third key point]
...
Final answer: [Answer]
```

### Example: Logic Puzzle

```
Q: Alice and Bob are in a room. Alice says 
   "If I have a coin, then Bob has a coin."
   Alice has a coin. Does Bob have a coin?

NAIVE ANSWER: "Maybe"

COT ANSWER:
Let me think through this logically:
1. Alice says: "If I have a coin → Bob has a coin"
2. Fact: Alice has a coin (given)
3. Since Alice has a coin, and her statement 
   is "if I have coin then Bob has coin"
4. The condition (Alice has coin) is TRUE
5. When the condition is true, the consequence 
   must be true: Bob has a coin
6. Conclusion: Bob MUST have a coin
```

## Techniques to Enhance Reasoning

### Technique 1: Decomposition

Break complex task into subtasks:

```
GOAL: Analyze impact of new technology

DECOMPOSE INTO:
1. What is the technology?
2. How does it work?
3. Who are stakeholders?
4. What are benefits?
5. What are risks?
6. What is overall impact?
```

### Technique 2: Constraint Satisfaction

Explicitly list constraints to satisfy:

```
PROBLEM: Plan a product launch

CONSTRAINTS:
- Budget: $500K max
- Timeline: 3 months
- Team: 5 people
- Market: Tech-savvy millennials
- Channels: Digital only

Each element of plan must satisfy all constraints
```

### Technique 3: Socratic Method

Ask leading questions that guide reasoning:

```
GOAL: Understand why a startup failed

GUIDING QUESTIONS:
1. What was the original vision?
2. Did market conditions match assumptions?
3. What was the competition doing?
4. How did the team respond to challenges?
5. What would you do differently?

Answering each guides to root causes
```

## Real-World Example: Code Review

```
PROMPT:
"Review this Python function step by step.
Check for: logic errors, inefficiency, 
readability issues. Show your reasoning.

CODE:
def find_max(arr):
    max_val = arr[0]
    for i in range(1, len(arr)):
        if arr[i] > max_val:
            max_val = arr[i]
    return max_val

ANALYSIS (step by step):
1. Purpose check: Function finds maximum 
   value in array
2. Logic check:
   - Initialize max to first element ✓
   - Compare each subsequent element ✓
   - Update when larger found ✓
   - Logic is correct
3. Edge cases:
   - Empty array: Would crash (arr[0])
   - Single element: Works ✓
   - All same: Works ✓
4. Efficiency: O(n) - good for this task
5. Readability:
   - Name is clear ✓
   - Logic is straightforward ✓
   - Could add docstring
6. Overall: Works correctly but missing 
   empty array check"
```

## Chain-of-Thought for Different Domains

### Science: Experimental Design

```
QUESTION: Design an experiment to test 
if plants grow faster with more sunlight

COT APPROACH:
1. What's the hypothesis?
   (Plants grow faster with more sunlight)
2. Independent variable?
   (Amount of sunlight: control the hours)
3. Dependent variable?
   (Plant growth: measure height over time)
4. Controls to keep constant?
   (Water, temperature, soil, plant type)
5. Measurement method?
   (Measure height weekly with ruler)
6. Duration?
   (4 weeks minimum)
7. Replication?
   (Multiple plants per condition)
```

### Business: Decision Making

```
DECISION: Should we expand to new market?

COT ANALYSIS:
1. Market analysis:
   - Size: $100M annually
   - Growth: 15% year over year
   - Competitors: 3 major players
2. Our position:
   - Market share (current): 0%
   - Competitive advantage: Lower price
   - Resources needed: $2M investment
3. Risk analysis:
   - Market risk: Medium (competitive)
   - Execution risk: Medium (new territory)
   - Financial risk: Low (sustainable)
4. ROI calculation:
   - Break-even: 2 years
   - 5-year profit projection: $8M
5. Recommendation: YES, proceed with caution
```

## Chain-of-Thought Variants

### Least-to-Most Prompting

Start with easy sub-problems, build to hard:

```
PROBLEM: Solve this multi-step math problem
         (4+2)×3 - 5 = ?

LEAST-TO-MOST:
Sub-problem 1 (easiest): What is 4+2?
Answer: 6

Sub-problem 2 (medium): What is 6×3?
Answer: 18

Sub-problem 3 (hardest): What is 18-5?
Answer: 13

Final answer: 13
```

### Self-Criticism

Have model check its own work:

```
INITIAL RESPONSE:
"The capital of France is London"

SELF-CRITICISM PROMPT:
"Check your previous answer. Is it correct?
If not, what should it be?"

REVISED RESPONSE:
"My previous answer was wrong. London is 
in England. The capital of France is Paris."
```

## When to Use Chain-of-Thought

**Use CoT when:**
- Problem requires multiple steps
- Logic is important
- Accuracy matters more than speed
- You want to verify reasoning
- Task is complex or unfamiliar

**Skip CoT when:**
- Simple, one-step answer needed
- Speed is critical
- You're confident in model accuracy
- Task is very familiar to model

## Measuring Reasoning Quality

```
EVALUATION CRITERIA:

1. Completeness
   ✓ All steps shown?
   ✓ No logical jumps?

2. Correctness
   ✓ Each step valid?
   ✓ Final answer right?

3. Clarity
   ✓ Easy to follow?
   ✓ Jargon minimized?

4. Efficiency
   ✓ Shortest reasonable path?
   ✓ No unnecessary steps?
```

## Summary

Chain-of-Thought prompting:

1. **Breaks complexity**: Large problem → small steps
2. **Reduces errors**: Easier to get each step right
3. **Verifiable**: You can check reasoning
4. **Flexible**: Works for any domain
5. **Improves accuracy**: Especially on complex tasks

By asking models to show their thinking, you get not just answers but explanations you can trust.

---

**Previous:** [Few-Shot Learning and Examples](./03-few-shot-learning.md) | **Next:** [Function Calling and Tool Use](./05-function-calling.md)
