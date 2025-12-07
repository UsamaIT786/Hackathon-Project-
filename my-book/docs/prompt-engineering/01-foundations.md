---
title: "Foundations of Prompting"
description: "Learn the fundamentals of effective prompt engineering with large language models."
keywords:
  - "prompting"
  - "language models"
  - "prompt engineering"
  - "communication"
---

# Foundations of Prompting

## Overview

Prompt engineering is the art and science of communicating with AI language models to get desired outputs. Unlike traditional programming where you write explicit instructions, prompting is about asking large language models (LLMs) the right questions in the right way. This chapter covers foundational concepts that underpin all effective prompting.

## Key Concepts

- **Prompt**: The input you give to an AI model
- **Completion**: The model's response
- **Context**: Surrounding information that shapes the response
- **Instruction clarity**: Being explicit about what you want
- **Few-shot learning**: Providing examples instead of explanations
- **Token**: Basic unit of text (roughly 4 characters per token)
- **Temperature**: Controls randomness/creativity of response

## What is a Prompt?

A prompt is any input to a language model. It can be:

```
Simple:
  "What is 2+2?"

Detailed:
  "You are a math tutor. 
   Explain how to solve: 2+2=?
   Use simple language."

Structured:
  "TASK: Solve math problem
   INPUT: 2+2
   OUTPUT FORMAT: Just the number"
```

## The Anatomy of a Good Prompt

### Component 1: Role/Context

Tell the model what role to play:

```
❌ Poor: "How do I improve my code?"
✅ Better: "You are an experienced Python developer. 
           How can I improve this code for readability?"
```

### Component 2: Task

Be explicit about what you want:

```
❌ Vague: "Tell me about robots"
✅ Clear: "Explain how robots perceive their environment
          using sensors, in 100 words"
```

### Component 3: Details/Constraints

Provide context and constraints:

```
❌ Missing info: "Translate this to Spanish"
✅ With context: "Translate this C++ code to Python.
                 Keep variable names unchanged.
                 Add comments explaining key differences."
```

### Component 4: Examples (Optional but Powerful)

Show what good output looks like:

```
TASK: Classify sentiment

EXAMPLES:
Input: "I love this movie!"
Output: positive

Input: "This is terrible"
Output: negative

NOW CLASSIFY:
Input: "It's okay, not great"
Output: ?
```

### Component 5: Output Format

Specify exact format wanted:

```
❌ Ambiguous: "What's the weather?"
✅ Clear: "What's the weather in NYC tomorrow?
          Format: JSON with keys [temperature, condition, humidity]"
```

## How Language Models Work (Briefly)

Understanding how models work helps you prompt better:

```
Your prompt → Model processes token-by-token
                 predicts next token probabilistically
                 Continues until stopping condition

Example:
Input: "The capital of France is"
Model thinks:
  "Given 'The capital of France is'
   Next token is probably 'Paris' (90% confidence)
   Then probably '.' (85% confidence)
   Done."
Output: "The capital of France is Paris."
```

**Key insight:** Models predict one token at a time, based on what came before. This means:
- Order matters (tell context first)
- Repetition strengthens concepts (mention key ideas multiple times)
- Beginning and end are emphasized (put important stuff there)

## Token Limits and Context

### Understanding Tokens

```
"The quick brown fox"
= 4 tokens (roughly 1 token per word, varies)

"I love Python programming!"
= 5 tokens

Tokens include:
- Words
- Punctuation
- Numbers
- Spaces (sometimes)
- Special characters
```

### Context Window

Models have finite context (number of tokens they can process):

```
GPT-4: 8,000 tokens (can be extended to 128,000)
GPT-3.5: 4,000 tokens
Claude 3 Opus: 200,000 tokens

Practical implications:
- Can't paste entire book and ask questions
- Must be selective with context
- Long documents require summarization first
```

### Prompt + Response + History = Total Tokens

```
Conversation:
User:   "Hello, who are you?" (4 tokens)
Model:  "I am Claude..." (100 tokens)
User:   "What's Python?" (4 tokens)
Model:  "Python is..." (100 tokens)
User:   "How do I learn it?" (5 tokens)
← Current position: 213 tokens used
← Remaining budget: If limit is 4000, have ~3787 left
```

**Strategy:** Use longer models when building on previous context

## Temperature: Creativity vs. Consistency

Temperature controls how deterministic the model is:

```
Temperature = 0
Behavior: Always pick most likely token (deterministic)
Output: Always same for same input
Example: Math problem → Always correct answer
Use case: Facts, coding, consistency needed

Temperature = 0.5
Behavior: Mix of likely and diverse tokens
Output: Some variation, generally good
Use case: Most practical use

Temperature = 1.0+
Behavior: More randomness, less likely tokens allowed
Output: More creative but less reliable
Use case: Creative writing, brainstorming
```

## The Chain of Thought Technique

Instead of asking for just an answer, ask the model to show its thinking:

```
❌ Direct:
Q: What's 34 × 17?
A: 578 (might be wrong)

✅ Chain of Thought:
Q: What's 34 × 17? Show your work step by step.
A: 
  30 × 17 = 510
  4 × 17 = 68
  510 + 68 = 578
(More reliable, easier to verify)
```

This technique dramatically improves accuracy on complex problems.

## Practical Example: Using a Programming Assistant

**Task:** Get code review from AI

### Bad Prompt:

```
Review my code:
[1000 lines of code]
```

**Problems:** Too much context, unclear what you want

### Good Prompt:

```
You are an expert Python code reviewer 
specializing in performance and readability.

TASK: Review the following function for:
1. Performance bottlenecks
2. Readability improvements
3. Potential bugs

CODE:
def process_data(items):
    result = []
    for item in items:
        if check_condition(item):
            result.append(transform(item))
    return result

IMPORTANT: Suggest specific improvements with code examples.
FORMAT: Output as bulleted list with examples.
```

**Better because:**
- Sets expert role
- Clear what you want reviewed
- Specific format requested
- Concrete example code

## Common Prompting Mistakes

### Mistake 1: Assuming the Model Knows Context

```
❌ "How do I fix it?"
   (Model: Fix what? Don't know your context)

✅ "I have a Python function that crashes when 
    processing empty lists. How do I fix it?"
```

### Mistake 2: Being Too Vague

```
❌ "Tell me about AI"
   (Could mean: History, current state, future, 
    applications, ethics, technical details...)

✅ "Explain how transformers work in NLP, 
    targeting someone with ML basics but new to NLP"
```

### Mistake 3: Asking Multiple Questions at Once

```
❌ "What's Python? Why use it? How to learn it? 
    Best projects for beginners?"
   (Confusing, ambiguous)

✅ Ask one question per prompt, build on previous answers
```

### Mistake 4: Not Specifying Output Format

```
❌ "What are the benefits of robotics?"
   (Could be: Paragraph, list, table, JSON, etc.)

✅ "What are the top 5 benefits of robotics in manufacturing?
    Format as: - Benefit: [description]"
```

## Testing and Iterating Prompts

Good prompts are rarely perfect on first try. Iterate:

```
1. Write initial prompt
2. Try it on the model
3. Evaluate output quality:
   ├─ Does it answer the question?
   ├─ Is it accurate?
   ├─ Is format correct?
   └─ Could it be better?
4. Refine prompt based on results
5. Repeat until satisfied
```

### Evaluation Rubric

```
Accuracy:      ✓ Correct?
Completeness:  ✓ Covered all aspects?
Format:        ✓ Right structure?
Clarity:       ✓ Easy to understand?
Length:        ✓ Right detail level?
```

## Real-World Application: Robotics Instruction

### Scenario: Robot Taking Instructions

```
SYSTEM PROMPT (set once):
"You are a robot that understands and executes 
instructions. You have arms, wheels, and sensors. 
Only respond with valid commands: 
MOVE, GRAB, RELEASE, PERCEIVE"

USER PROMPT:
"What's in front of you?"

EXPECTED OUTPUT:
"PERCEIVE forward"

USER PROMPT:
"Pick up the red block and put it on the table"

EXPECTED OUTPUT:
"PERCEIVE forward
 MOVE toward red_block
 GRAB red_block
 MOVE toward table
 RELEASE red_block"
```

This works because the system prompt constrains the model to only generate valid commands.

## Token Efficiency Tips

Keep prompts concise to save tokens:

```
Instead of:
"Please explain in detail how neural networks..."

Try:
"Explain neural networks briefly"

Instead of:
"I would really appreciate if you could help me..."

Try:
"Help me..."

Instead of:
"This may be a simple question, but..."

Try:
Just ask directly
```

## Summary

Prompt engineering fundamentals:

1. **Be explicit**: Tell the model role, task, and constraints
2. **Provide context**: Models need information to work with
3. **Show examples**: Few-shot learning often works better than explanation
4. **Specify format**: Output should match your needs exactly
5. **Iterate**: Test and refine until satisfied
6. **Respect tokens**: Long prompts cost money and slow response

These foundations apply whether you're building production systems or experimenting. Master these basics and you'll be an effective prompter.

---

**Previous:** [Real-Time Systems](../physical-ai/06-real-time-systems.md) | **Next:** [Advanced Prompting Techniques](./02-advanced-techniques.md)
