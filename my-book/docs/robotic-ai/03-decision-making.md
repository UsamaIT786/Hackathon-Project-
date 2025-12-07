---
title: "Decision-Making and Planning"
description: "How robots decide what to do and plan their actions."
keywords:
  - "planning"
  - "decision making"
  - "path planning"
  - "task planning"
---

# Decision-Making and Planning

## Overview

After perceiving the world, robots must decide what to do and plan how to do it. This chapter covers the algorithms and techniques robots use for reasoning and planning.

## Task Planning

Converting goals into sequences of actions:

```
Goal: "Pick up the red cube and place on table"

Decompose into:
1. Perceive location of red cube
2. Plan arm motion to cube
3. Close gripper
4. Plan arm motion to table
5. Open gripper
6. Verify success
```

## Path Planning

Finding collision-free paths through space:

**RRT (Rapidly-exploring Random Trees)**:
- Builds tree of possible positions
- Randomly samples space
- Connects samples gradually
- Efficient for high-dimensional spaces

**A* Algorithm**:
- Uses cost estimates
- Explores promising paths first
- Guarantees optimal path (if exists)
- Works on grids or graphs

## Reactive vs. Deliberative

**Reactive**: Respond immediately based on sensors
- Fast
- No planning
- Good for reflexive behaviors

**Deliberative**: Plan before acting
- Slower
- More capable
- Required for complex tasks

**Hybrid**: Combine both
- Plan globally
- React locally
- Best approach for real robots

## Summary

Decision-making and planning transform perception into purposeful action. Modern robots combine multiple planning algorithms for robustness.

---

**Previous:** [Robot Perception and Vision](./02-robot-perception.md) | **Next:** [Manipulation and Grasping](./04-manipulation.md)
