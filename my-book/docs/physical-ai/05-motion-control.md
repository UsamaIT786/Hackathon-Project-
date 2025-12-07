---
title: "Motion and Control"
description: "Understand how robots move and control their physical actions."
keywords:
  - "motion control"
  - "kinematics"
  - "dynamics"
  - "actuators"
---

# Motion and Control

## Overview

Perception without action is useless. A robot must convert its understanding of the world into physical motion. This chapter covers how robots move: from simple motor commands to complex multi-joint coordination. We'll explore kinematics (geometry of motion) and control theory (how to achieve desired motion).

## Key Concepts

- **Kinematics**: Geometry of movement (position and velocity)
- **Dynamics**: Forces and accelerations
- **Actuators**: Motors, pumps, solenoids that create motion
- **Control loops**: Feedback mechanisms ensuring accuracy
- **Trajectory planning**: Moving from A to B smoothly
- **Inverse kinematics**: Computing joint angles for desired end-effector position

## Types of Actuators

### 1. Electric Motors

**DC Motor:**
- Simple voltage → rotation
- Speed proportional to voltage
- Torque proportional to current
- Most common in robotics

```
     ┌─────┐
   ┌─┤     ├─┐
   │ └─────┘ │
   │    ↓    │
   ├─────────┤
   │  Motor  │  Voltage Input
   │    ↓    │  Speed Output
   ├─────────┤
   │    ↑    │
   └─┬─────┬─┘
     │     │
     ↓     ↓
  Wheels rotate
```

**Servo Motor:**
- Precise position control
- Built-in feedback (encoder)
- Knows its exact angle
- Used in robot arms

**Stepper Motor:**
- Move in discrete steps
- No feedback needed
- Position always known
- Used when absolute position matters

### 2. Hydraulic and Pneumatic Actuators

**Hydraulic:**
- Powerful (high force)
- Precise control
- Used in heavy industrial robots
- Requires pump, fluid, hoses

**Pneumatic:**
- Simple, cheap
- Good for on/off actions
- Limited precision
- Used in grippers, simple joints

### 3. Specialized Actuators

**Solenoids:** Electromagnet pulls plunger (locking, releasing)
**Shape-Memory Alloys:** Wire contracts when heated
**Piezoelectric:** Tiny precise movements
**Electroactive Polymers:** Flex-muscle-like motion

## Forward Kinematics

**Question:** If I know all joint angles, where is the end-effector?

### 2-Link Arm Example

```
Simple arm with 2 joints:

Starting position:        After rotating:
    Joint 2               
      |                      ──Joint 2
      |                     /
    Joint 1 ─────        ─ Joint 1
                        /
    Base                Base

Link 1 length: L1 = 1.0
Link 2 length: L2 = 0.8
Joint 1 angle: θ1 = 90°
Joint 2 angle: θ2 = 45°

End-effector position:
X = L1·cos(θ1) + L2·cos(θ1 + θ2)
  = 1.0·cos(90°) + 0.8·cos(135°)
  = 0 + (-0.566)
  = -0.566

Y = L1·sin(θ1) + L2·sin(θ1 + θ2)
  = 1.0·sin(90°) + 0.8·sin(135°)
  = 1.0 + 0.566
  = 1.566

End-effector at (-0.566, 1.566)
```

This is relatively straightforward—just trigonometry.

## Inverse Kinematics

**Question (much harder!):** I want the end-effector at position (X, Y). What joint angles should I use?

### The Complexity

```
Forward (easy):
  Joint angles → End-effector position
  θ1=90°, θ2=45° → (X=-0.566, Y=1.566)

Inverse (hard):
  End-effector position → Joint angles
  (X=?, Y=?) → θ1=?, θ2=?
  
Problem: Multiple solutions possible!
         No solution possible (out of reach)
         Infinite solutions (redundant joints)
```

### Example: Reaching a Point

```
Goal: Grasp object at position (1.0, 0.5)

Possible joint configurations:
Configuration A: θ1=45°, θ2=20°
Configuration B: θ1=50°, θ2=10°
Configuration C: θ1=40°, θ2=30°

All reach the same point!
Choose the one with:
- Least energy
- Shortest path
- Safest (no obstacles)
- Fastest execution
```

### Solving Inverse Kinematics

**Analytical Solution:**
- Solve equations algebraically
- Fast and exact
- Only possible for simple arms
- Used when possible

**Numerical Solution:**
- Iteratively adjust joint angles
- Works for any arm geometry
- Slower but more general
- May have local minima

```python
# Simplified numerical IK
import numpy as np

def forward_kinematics(theta1, theta2, L1=1.0, L2=0.8):
    x = L1*np.cos(theta1) + L2*np.cos(theta1 + theta2)
    y = L1*np.sin(theta1) + L2*np.sin(theta1 + theta2)
    return np.array([x, y])

def solve_ik(target_pos, max_iterations=100):
    # Start with random guess
    theta = np.array([0.0, 0.0])
    learning_rate = 0.01
    
    for i in range(max_iterations):
        # Forward kinematics
        current_pos = forward_kinematics(theta[0], theta[1])
        error = target_pos - current_pos
        
        if np.linalg.norm(error) < 0.01:  # Close enough
            return theta
        
        # Gradient descent (numerical optimization)
        for j in range(2):
            dtheta = 0.001
            theta_plus = theta.copy()
            theta_plus[j] += dtheta
            
            pos_plus = forward_kinematics(theta_plus[0], theta_plus[1])
            gradient = (np.linalg.norm(target_pos - pos_plus) - 
                       np.linalg.norm(error)) / dtheta
            
            theta[j] -= learning_rate * gradient
    
    return theta
```

## Control Loops

A **control loop** adjusts actuator commands based on feedback.

### Open-Loop Control

```
Command → Motor → Action → (No feedback)

Example: Wheelchair moving forward
  Command: "Run motor at 50% speed for 5 seconds"
  Result: Moved 10 meters (hope this was enough!)
```

**Problem**: No correction for errors, obstacles, or unexpected changes

### Closed-Loop Control (Feedback)

```
     ┌────────────────────┐
     │                    │
  Command → [Controller] → Motor → Action
     │        ↓                       │
     │    Compares           ┌────────┘
     │                       │
     └───── Sensor reading ──┘

Example: Maintaining constant speed
  Desired: 1.0 m/s
  Sensor reads: 0.8 m/s (slower!)
  Error: 0.2 m/s too slow
  Action: Increase motor power
  Sensor reads: 1.0 m/s
  Error: 0 (perfect!)
  Action: Maintain power
```

### PID Control: The Most Common Approach

PID = Proportional + Integral + Derivative

```python
class PIDController:
    def __init__(self, kp, ki, kd):
        self.kp = kp  # Proportional gain
        self.ki = ki  # Integral gain
        self.kd = kd  # Derivative gain
        self.error_integral = 0
        self.last_error = 0
    
    def update(self, desired, current, dt):
        # Error (how far from goal)
        error = desired - current
        
        # Proportional: React to current error
        p_term = self.kp * error
        
        # Integral: React to accumulated error
        self.error_integral += error * dt
        i_term = self.ki * self.error_integral
        
        # Derivative: React to rate of change
        error_rate = (error - self.last_error) / dt
        d_term = self.kd * error_rate
        
        # Combined control signal
        output = p_term + i_term + d_term
        
        self.last_error = error
        return output
```

### PID Gains Explained

**P (Proportional):**
- Proportional to current error
- Too high: Overshoots, oscillates
- Too low: Slow response

**I (Integral):**
- Accumulates error over time
- Eliminates steady-state error
- Too high: Slow, oscillates
- Balances out constant biases

**D (Derivative):**
- Responds to change rate
- Dampens oscillations
- Too high: Noisy, jerky
- Predicts future behavior

### Tuning PID Gains

```
Starting point:
kp = 1.0
ki = 0.0
kd = 0.0

Iterate:
1. Run, observe response
2. If oscillating: Increase kd
3. If slow: Increase kp
4. If offset remains: Increase ki
5. Repeat until good response
```

## Trajectory Planning

Moving from point A to point B smoothly, avoiding obstacles.

### Simple Linear Trajectory

```
Time: 0.0s → 1.0s
Start: (0, 0)
End: (1, 1)

Position = Start + (End - Start) * (Time / Duration)
t=0.0s: (0.0, 0.0)
t=0.5s: (0.5, 0.5)
t=1.0s: (1.0, 1.0)
```

**Problem**: Sudden start/stop (infinite acceleration)

### Smooth Trajectory

```
         Start soft
            ║
            ╱╲
   ╱────────╱  ╲────────╲
 Start       Cruise      End soft
 
Acceleration phase: Smoothly increase speed
Cruise phase: Constant speed
Deceleration phase: Smoothly decrease speed

Result: No jerky motion, smoother on hardware
```

### Obstacle Avoidance in Trajectory

```
Goal: Reach target without hitting walls

Simple path:        Obstacle aware path:
    ◎                    ◎
    │                  ╱─╲
    │                 ╱   ╲
    │                 │  ░░│
    │                 │  ░░│
    X                 X  Wall

Algorithm:
1. Check if straight line hits obstacle
2. If yes, plan around obstacle
3. Find path through free space
4. Smooth the path
```

## Real-World Example: Robot Arm Picking

Complete control pipeline:

```
1. PERCEPTION
   ├─ Camera sees object at (X=0.5m, Y=1.0m)
   └─ Depth sensor confirms distance = 0.3m

2. PLANNING
   ├─ Inverse kinematics: Calculate needed joint angles
   │  θ1 = 45°, θ2 = 30°, θ3 = -20°
   ├─ Plan trajectory to avoid obstacles
   └─ Generate smooth motion profile

3. CONTROL
   ├─ For each joint:
   │  ├─ Read current angle (encoder)
   │  ├─ Compare to desired angle
   │  ├─ PID controller outputs motor command
   │  └─ Send voltage to motor
   ├─ Repeat at 100 Hz
   └─ Monitor for collisions/errors

4. EXECUTION
   ├─ Joint 1 moves to 45° (takes 0.5s)
   ├─ Joint 2 moves to 30° (takes 0.4s)
   ├─ Joint 3 moves to -20° (takes 0.3s)
   └─ Arm reaches object

5. FEEDBACK
   ├─ Force sensor confirms grip contact
   ├─ Update state: "Object grasped"
   └─ Prepare for next action
```

## Challenges in Real Motion Control

### Challenge 1: Backlash

Gears have tiny gaps (backlash):
```
Command: Rotate 10°
Actual: Rotate 9.2° (0.8° lost in gear gaps)
```

**Solution**: Use high-quality gears, model backlash, compensate commands

### Challenge 2: Friction and Stiction

- **Friction**: Resistance to motion
- **Stiction**: Resistance to starting motion (higher than friction)

```
Command: Rotate at constant 1 rad/s
Actual: Jerky (stop-start) due to changing friction
```

**Solution**: Friction modeling, tuning controllers, sufficient power

### Challenge 3: Deadbands

Some motors need minimum voltage before moving:

```
0-2 volts: No motion
2-10 volts: Full range of motion

Command: Move slowly (use 1V)
Result: No movement!
```

**Solution**: Map commands to account for deadband

### Challenge 4: Saturation

Motors can only provide finite force/torque:

```
Ideal: Unlimited power
Reality: Motor can only output 100 N-m
Command requests 150 N-m
Result: Limited to 100 N-m (saturated)
```

**Solution**: Plan trajectories within physical limits

## Summary

Motion and control transform robot understanding into action:

1. **Kinematics**: Geometry of motion (forward and inverse)
2. **Actuators**: Motors and pumps create motion
3. **Control loops**: Feedback ensures accuracy
4. **PID control**: Simple, effective standard approach
5. **Trajectory planning**: Smooth, safe movement
6. **Real-world challenges**: Friction, backlash, saturation all matter

Understanding motion control is essential for building robots that can reliably manipulate their environment.

---

**Previous:** [Sensor Fusion](./04-sensor-fusion.md) | **Next:** [Real-Time Systems](./06-real-time-systems.md)
