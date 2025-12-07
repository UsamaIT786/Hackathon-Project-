---
title: "Multi-Modal Prompting"
description: "Combine text, images, and other modalities in prompts."
keywords:
  - "multimodal"
  - "vision"
  - "images"
  - "prompting"
---

# Multi-Modal Prompting

## Overview

Modern language models handle more than text—images, audio, and video. Multi-modal prompting combines different types of input to get better results. This chapter covers how to leverage multiple modalities effectively.

## Modalities in Modern Models

### Text
- Input: Words, sentences, documents
- Output: Text responses
- Examples: GPT-4, Claude

### Vision
- Input: Images, diagrams, screenshots
- Output: Text descriptions and analysis
- Examples: GPT-4V, Claude 3 with vision

### Audio (Emerging)
- Input: Speech, music, sounds
- Output: Transcriptions, summaries, analysis
- Examples: Whisper, Gemini

### Multimodal Models
Combine multiple modalities:
- Understand images in context of text
- Describe images, charts, diagrams
- Answer questions about visual content
- Generate images from descriptions

## Vision-Language Models

### Capabilities

Modern vision models can:
1. **Recognize objects**: "There's a cat and a ball"
2. **Read text**: "The sign says 'Open Daily'"
3. **Answer questions**: "How many people in the image?"
4. **Describe context**: "This is an office setting"
5. **Analyze charts**: "Sales increased 20% in Q3"

### Example: Image Analysis

```
PROMPT:
"Analyze this image. What's happening?
 Who are the people? What objects are present?"

IMAGE: [Photo of team in office]

RESPONSE:
"This image shows a professional office setting
with 4 people around a conference table. 
Key objects include:
- Laptops (3)
- Coffee cups (2)
- Whiteboard with diagrams
- Windows with natural light
Activity: Appears to be a meeting or brainstorm session"
```

## Practical Applications

### Application 1: Document Analysis

```
INPUT: Screenshot of contract
TASK: "Summarize key terms. Highlight risks."

OUTPUT: 
"Key Terms:
- 2-year term starting Jan 2024
- $500K annual payment
- Termination: 30-day notice

Risks:
- IP ownership unclear
- Non-compete broadly defined
- Liability cap unusually low"
```

### Application 2: UI/UX Review

```
INPUT: Screenshot of website
TASK: "Review this website design.
       What works? What needs improvement?"

OUTPUT:
"What works:
- Clear hierarchy and navigation
- Good color contrast
- Mobile responsive layout

Needs improvement:
- CTA button not prominent enough
- Form fields could use more spacing
- 'About' section too text-heavy"
```

### Application 3: Data Visualization

```
INPUT: Chart showing monthly sales
TASK: "Analyze this sales chart.
       What trends do you see?
       What's the business impact?"

OUTPUT:
"Trends observed:
- Steady growth January-August (+35%)
- Sharp dip in September (-20%)
- Recovery in October-November

Business impact:
- Overall positive trajectory
- September dip needs investigation
- Projected: +25% growth by year-end"
```

## Prompting Strategies for Vision

### Strategy 1: Provide Context

```
❌ Weak:
"What's in this image?"

✅ Strong:
"This is a product photo for an e-commerce site.
Analyze it for:
1. Product visibility
2. Lighting quality
3. Background appropriateness
4. Whether it would convert buyers"
```

### Strategy 2: Ask Specific Questions

```
❌ Vague:
"Tell me about this diagram"

✅ Specific:
"This is a system architecture diagram.
- Identify all components
- Explain data flow
- Flag any potential bottlenecks
- Suggest improvements"
```

### Strategy 3: Multiple Images

```
TASK: Compare two product designs

IMAGE 1: Current design
IMAGE 2: Proposed design

PROMPT:
"Compare these designs.
What's better in each?
Which would you recommend? Why?"

MODEL can see both and provide comparison
```

## Creating Effective Image Prompts

### High-Quality Image Instruction

```
TASK: Generate robot assembly diagram
Include: [Robot, parts, assembly steps]
Style: [Technical, clean lines]
Size: [High resolution, 1024x1024]
Format: [PNG with transparent background]

Result: Model creates image matching specifications
```

### Interpretation Prompt

```
"Interpret this political cartoon.
What is the cartoonist's message?
Who are the subjects?
What techniques make it effective?"

Model can see image and provide analysis
```

## Multi-Modal Reasoning

Combine multiple images and reasoning:

```
TASK: Analyze before/after improvement

IMAGE 1 (Before): Office workspace
IMAGE 2 (After): Same office redesigned

PROMPT:
"Analyze both images. 
What changed?
What improvements do you see?
How would this affect productivity?"

Model can compare and reason across images
```

## Handling Large/Complex Images

```
Strategy 1: Crop
- Focus on relevant part of image
- Reduces token usage

Strategy 2: Annotate
- Add arrows, highlights to image
- Guide model's attention
- Mark areas of interest

Strategy 3: Multiple views
- Provide zoomed in and zoomed out
- Show details and overview
- Comprehensive understanding
```

## Quality Considerations

### Image Resolution
```
Low: 256x256 - Basic shapes only
Medium: 512x512 - Objects and text readable
High: 1024x1024+ - Fine details visible

Rule: Higher resolution when detail matters
```

### Format Matters
```
PNG: Best for diagrams, text
JPG: Good for photos, smaller files
Animated GIF: For showing motion/sequence
WebP: Modern format, smaller size
```

### Encoding
Models typically accept:
- Direct URLs to images
- Base64 encoded images
- Image file paths (local to system)

## Advanced: Combining Modalities

### Text + Image

```
PROMPT:
"Review this code screenshot along with 
 the requirement description below.

[Code screenshot]

Requirement:
'Function should process customer orders
 with validation and logging'

Assessment:
- Does code meet requirement?
- What's missing?
- What could be improved?"

Model uses both image and text for full context
```

### Multiple Images + Questions

```
PROMPT:
"Here are three product iteration screenshots
showing design evolution.

[Screenshot 1] [Screenshot 2] [Screenshot 3]

Analyze the evolution:
- What changed between versions?
- Why might these changes improve UX?
- What would you try next?"
```

## Future: Audio and Video

As models gain more modalities:

### Audio Transcription + Analysis
```
PROMPT:
"Transcribe this meeting recording and 
 summarize action items"

[Audio file]

Result: Transcription + summary
```

### Video Analysis
```
PROMPT:
"Analyze this 30-second product demo video.
What's the key message?
How effective is it?"

[Video file]

Result: Analysis of messaging, pacing, effectiveness
```

## Summary

Multi-modal prompting:

1. **Extends capability**: Combine different types of input
2. **Improves understanding**: Images provide context text can't
3. **Enables new tasks**: Analysis, comparison, verification
4. **Requires different prompting**: Strategies differ from text-only
5. **Still evolving**: New modalities being added

Mastering multi-modal prompting opens possibilities beyond text-based AI.

---

**Previous:** [Prompt Optimization and Tuning](./06-prompt-optimization.md) | **Next:** [Production Prompts](./08-production-prompts.md)
