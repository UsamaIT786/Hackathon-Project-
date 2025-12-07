---
title: "Manipulation and Grasping"
description: "How robots pick up and manipulate objects."
keywords:
  - "manipulation"
  - "grasping"
  - "dexterity"
  - "gripper design"
---

# Manipulation and Grasping

## Overview

Perception and decision-making are useless without the ability to manipulate objects. This chapter covers how robots grasp and manipulate things in the physical world.

## Gripper Types

**Parallel Jaw Gripper**:
- Two fingers close on object
- Simple, fast
- Works for many objects

**Anthropomorphic Hand**:
- Multiple fingers
- Dexterous
- Complex control

**Suction Cup**:
- Vacuum attachment
- Good for flat surfaces
- Non-prehensile

**Soft Gripper**:
- Compliant material
- Gentle on objects
- Adapts to shape

## Grasping Strategies

**Force Closure**:
- Firm grip prevents motion
- Multiple contact points
- Stable grasp

**Form Closure**:
- Shape of gripper matches object
- Geometric grasp
- Less force needed

**Grasp Planning**:
1. Identify contact points
2. Check stability
3. Verify collision-free
4. Execute grasp

## Challenges

- **Object variation**: Different shapes, sizes, weights
- **Fragility**: Some objects break easily
- **Speed**: Grasping takes time
- **Uncertainty**: Not always successful

## Learning Grasping

Modern approaches use learning from data:
- Train on thousands of grasp attempts
- Learn what works
- Generalize to new objects

## Summary

Manipulation is where planning meets reality. Effective grasping strategies combine geometry, physics, and learning.

---

**Previous:** [Decision-Making and Planning](./03-decision-making.md) | **Next:** [Human-Robot Interaction](./05-human-robot-interaction.md)
