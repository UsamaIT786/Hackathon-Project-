---
title: "Computer Vision Essentials"
description: "Master the fundamentals of computer vision for robotic systems."
keywords:
  - "computer vision"
  - "image processing"
  - "object detection"
  - "neural networks"
---

# Computer Vision Essentials

## Overview

Computer vision is the field of AI that teaches systems to understand images and video. For Physical AI, computer vision is critical—robots must "see" to act effectively. This chapter covers the essential concepts you need to understand how robots process visual information.

## Key Concepts

- **Image representation**: How computers understand pictures
- **Image processing**: Basic operations on images
- **Feature extraction**: Finding important patterns
- **Object detection**: Locating things in images
- **Semantic segmentation**: Understanding what each pixel represents
- **3D understanding**: Inferring depth and 3D structure

## How Computers Represent Images

### Digital Images as Matrices

A digital image is a matrix of pixel values:

```
Real Image (cat)
    ┌──────────────────┐
    │ █ █ █ █ █ █ █ █  │
    │ █ █ █ █ █ █ █ █  │
    │ █ █ ░ ░ ░ ░ █ █  │
    │ █ ░ ░ █ █ ░ ░ █  │
    │ █ ░ ░ ░ ░ ░ ░ █  │
    │ █ █ ░ ░ ░ ░ █ █  │
    │ █ █ █ █ █ █ █ █  │
    └──────────────────┘
    
Computer Representation (pixel values 0-255)
    ┌──────────────────┐
    │ 0   0   0   0  0 │
    │ 0  50 100 150  0 │
    │ 0 100 200 200  0 │
    │ 0 150 200 255  0 │
    │ 0 100 100 100  0 │
    │ 0  50  50  50  0 │
    │ 0   0   0   0  0 │
    └──────────────────┘
```

**Color images** have three channels (Red, Green, Blue):
- Each pixel has 3 values
- Combined, they create any color
- Total: Height × Width × 3 values

## Basic Image Processing Operations

### Operation 1: Thresholding

Convert grayscale image to black/white:

```
Original:  ░ ░ ░ ░ ░      Threshold at 128:   ░ ░ ░ ░ ░
           ░ █ █ ░ ░   →   ░ ░ ░ ░ ░
           ░ █ █ ░ ░       ░ ░ ░ ░ ░
           ░ ░ ░ ░ ░       ░ ░ ░ ░ ░
           
Pixels < 128 = black (0)
Pixels ≥ 128 = white (255)
```

**Use case**: Detect presence of object, simple object separation

### Operation 2: Edge Detection

Find boundaries between objects:

```
Original:         Edges:
┌─────────────┐   ┌─────────────┐
│ ░░░░░░░░░░░│   │ ░░░░░░░░░░░ │
│ ░█████████░│   │ ░█░░░░░░░█░ │
│ ░█████████░│   │ ░█░░░░░░░█░ │
│ ░█████████░│   │ ░█████████░ │
│ ░░░░░░░░░░░│   │ ░░░░░░░░░░░ │
└─────────────┘   └─────────────┘
```

**Algorithm**: Sobel operator computes gradients
**Use case**: Detect object boundaries, locate features

### Operation 3: Blurring (Smoothing)

Reduce noise by averaging neighboring pixels:

```
Original (noisy):     Blurred:
█░█░█░█░█             ░░░░░
░█░█░█░█░      →      ░░░░░
█░█░█░█░█             ░░░░░
░█░█░█░█░             ░░░░░
█░█░█░█░█             ░░░░░
```

**Use case**: Reduce sensor noise before processing

## Feature Extraction

Features are interesting patterns in images that help computers understand content.

### Types of Features

**Corners**: Points where edges meet at angles
```
┌──    ┌──
│      │
└──    └──
Corners: each has unique neighborhood
```

**Edges**: Boundaries between regions
```
░░░    ░░░    
░░░ vs ███
░░░    ░░░
Clear transition = edge
```

**Texture**: Repetitive patterns
```
════   ╬╬╬╬
════ vs ╬╬╬╬
════   ╬╬╬╬
Different patterns = different textures
```

**Color**: Dominant colors or color distributions
```
███   ░░░
███ vs ░░░
███   ░░░
Red   Blue
```

### Why Features Matter

Instead of processing millions of pixel values, feature extraction reduces data:
- 1000×1000 image = 1 million values
- Extract features = maybe 100-1000 features
- Much faster processing while keeping important information

## Convolutional Neural Networks (CNNs)

CNNs revolutionized computer vision by automatically learning features.

### How CNNs Work

A CNN applies **filters** (small windows) across the image:

```
Original Image          Filter (3×3)
┌─────────────┐        ┌───┐
│ █ █ █ █ █  │        │ 1 0 -1 │
│ ░ ░ ░ ░ ░  │  ×     │ 2 0 -2 │ = Edge detection
│ █ █ █ █ █  │        │ 1 0 -1 │
└─────────────┘        └───┘

Apply filter at each position:
Slide filter across entire image
Each position produces one output value
Result: Filtered image showing detected features
```

**Key insight**: Same filter applied everywhere means:
- Fewer parameters to learn
- Finds features regardless of location
- Much faster than fully-connected networks

### CNN Architecture Visualization

```
Input Image (224×224 pixels)
         ↓
    Conv Layer 1 (detect edges)
         ↓
    Conv Layer 2 (detect shapes)
         ↓
    Conv Layer 3 (detect parts)
         ↓
    Conv Layer 4 (detect objects)
         ↓
    Fully Connected Layer
         ↓
    Output (what's in image)
```

Each layer learns increasingly complex features:
- Layer 1: Edges, simple lines
- Layer 2: Shapes (circles, squares)
- Layer 3: Parts (eyes, wheels)
- Layer 4: Objects (faces, cars)

## Common Computer Vision Tasks

### Task 1: Image Classification

**Question**: What is in this image?

```
Input: Image
     ↓
   CNN
     ↓
Output: Cat (95% confidence)
        Dog (4% confidence)
        Person (1% confidence)
```

**Application**: Robot identifying object types
**Difficulty**: Easy to Medium
**Modern accuracy**: >99% on many datasets

### Task 2: Object Detection

**Question**: What objects are in this image and where?

```
Input: Image
     ↓
  Detect all objects + locations
     ↓
Output: 
  - Cat at (100, 200) with box size (80×90)
  - Dog at (300, 150) with box size (120×100)
  - Person at (500, 50) with box size (100×200)
```

**Application**: Robot locating specific object to grasp
**Difficulty**: Medium to Hard
**Key algorithms**: YOLO, R-CNN, SSD

**Example in robotics**:
```
Robot sees: Image from camera
Runs detection: "I see a cup at (250, 300)"
Plans action: "Move arm to grab that location"
```

### Task 3: Semantic Segmentation

**Question**: What is each pixel in the image?

```
Input: Road scene image
     ↓
  Classify every pixel
     ↓
Output: 
  Red pixels: Road
  Green pixels: Grass
  Blue pixels: Sky
  Gray pixels: Car
  White pixels: Person
```

**Application**: Autonomous vehicle understanding road layout
**Difficulty**: Hard
**Modern architectures**: U-Net, DeepLabV3

### Task 4: 3D Object Detection

**Question**: Where are objects in 3D space (not just 2D image)?

```
Input: Image + Depth data
     ↓
  Detect objects in 3D
     ↓
Output:
  - Cup at (0.5m forward, 0.2m left, 0.1m up)
  - Table at (0.3m forward, 0.0m left, 0.0m up)
```

**Application**: Robot arm picking objects at exact 3D locations
**Difficulty**: Very Hard
**Key methods**: PointNets, VoxelNets

## Practical Example: Detecting a Ball

Simple computer vision pipeline:

**Step 1: Capture image**
```python
import cv2
camera = cv2.VideoCapture(0)
ret, image = camera.read()  # Get frame from camera
```

**Step 2: Convert to HSV color space** (easier for color detection)
```python
hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
```

**Step 3: Find red pixels** (balls are often red)
```python
# Red color has specific HSV range
lower_red = np.array([0, 100, 100])
upper_red = np.array([10, 255, 255])
mask = cv2.inRange(hsv, lower_red, upper_red)
```

**Step 4: Find contours** (connected regions of red pixels)
```python
contours, _ = cv2.findContours(mask, ...)
```

**Step 5: Find largest contour** (likely the ball)
```python
largest_contour = max(contours, key=cv2.contourArea)
x, y, w, h = cv2.boundingRect(largest_contour)
```

**Step 6: Draw result**
```python
cv2.rectangle(image, (x,y), (x+w,y+h), (0,255,0), 2)
cv2.imshow('Detected Ball', image)
```

**Result**: Robot knows where ball is and can pick it up!

## Computer Vision in Real Robots

### Perception Pipeline Example: Warehouse Robot

```
Raw camera feed (30 Hz)
        ↓
  Object detection model
        ↓
  Found box at (340, 250)
  Confidence: 95%
        ↓
  Depth sensor data
        ↓
  Box is 2.5m away
        ↓
  Motion planning
        ↓
  Drive robot toward box
        ↓
  Update perception continuously
  (If box position changes, adjust)
```

### Challenges in Real-World Vision

1. **Lighting variations**: Different lighting makes detection hard
2. **Occlusion**: Objects hidden behind other objects
3. **Scale**: Objects appear different sizes at different distances
4. **Viewpoint**: Same object looks different from angles
5. **Real-time constraints**: Must process 30+ frames per second

## State-of-the-Art Methods (2024-2025)

### Vision Transformers (ViT)

New architecture that challenges CNNs:
- Split image into patches
- Treat like sequence (similar to language processing)
- Often works better on new tasks
- Becoming dominant in research

### Multimodal Models

Combine vision with language:
```
Image + Text: "What color is the ball?"
        ↓
   Multimodal model
        ↓
  Output: "The ball is red"
```

Example: GPT-4V (GPT-4 with Vision)
**Application**: Robot understanding complex instructions with images

### Real-Time Edge Models

Optimized models for fast processing on robots:
- Smaller models (fewer parameters)
- Quantized (lower precision)
- Still accurate enough
- Run on robot directly (no cloud needed)

## Summary

Computer vision is essential for Physical AI because:

1. **Robots must see**: Vision is primary sensing modality
2. **Deep learning works**: CNNs and newer methods are highly effective
3. **Real-time is possible**: Modern models can process video in real-time
4. **Practical applications exist**: Already used in manufacturing, delivery, autonomous vehicles
5. **Rapidly improving**: New methods emerge constantly

Understanding computer vision gives you the foundation for building intelligent physical systems that can perceive and interact with the world.

---

**Previous:** [Sensors and Perception](./02-sensors-perception.md) | **Next:** [Sensor Fusion](./04-sensor-fusion.md)
