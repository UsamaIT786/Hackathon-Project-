---
title: "Sensor Fusion"
description: "Combine multiple sensors for robust perception and better decision-making."
keywords:
  - "sensor fusion"
  - "kalman filter"
  - "uncertainty"
  - "state estimation"
---

# Sensor Fusion

## Overview

Individual sensors are imperfect—cameras fail in darkness, lidar struggles with rain, GPS loses signal indoors. The solution is sensor fusion: intelligently combining data from multiple sensors to achieve robust, accurate perception. This chapter explains how to fuse sensor data and why it's essential for real-world robots.

## Key Concepts

- **Complementary sensors**: Different sensors providing different information
- **Uncertainty modeling**: Representing confidence in measurements
- **State estimation**: Maintaining belief about world state
- **Kalman Filter**: Most popular sensor fusion algorithm
- **Weighted averaging**: Simple approach when Kalman is overkill
- **Real-time fusion**: Processing multiple streams simultaneously

## Why Sensor Fusion Matters

### Problem Statement

A delivery robot must navigate:
- **Camera alone**: Gets confused in repetitive hallways
- **Lidar alone**: Struggles in open outdoor areas
- **GPS alone**: Loses signal indoors
- **Odometry alone**: Drifts (thinks it's moved more than it has)

**Solution**: Fuse all sensors
- GPS provides broad location when available
- Lidar provides local accuracy
- Camera recognizes specific locations (doors, signs)
- Odometry detects and corrects drift

**Result**: Robot stays localized everywhere

### Mathematical Motivation

When combining measurements from multiple sensors:

```
Sensor 1: Position = 1.5m ± 0.3m
Sensor 2: Position = 1.4m ± 0.1m

Naive approach: Average = 1.45m
Better approach: Weight by uncertainty
  Weight 2 more (lower uncertainty)
  Result: 1.41m (closer to more confident sensor)
```

## Kalman Filter: The Standard Approach

The Kalman Filter is the most popular sensor fusion algorithm. It's elegant, computationally efficient, and works remarkably well.

### How Kalman Filter Works (Conceptually)

```
Step 1: PREDICTION
  Based on last known state and motion model
  "I was here, I moved this way, so I should be ~here"
  
Step 2: MEASUREMENT
  Sensors tell us something
  "I see this (but with noise)"
  
Step 3: CORRECTION
  Blend prediction with measurement
  Weight by confidence (uncertainty)
  Update best estimate of state
  
Step 4: REPEAT
  Process continues each time step
```

### Kalman Filter in Practice

```python
import numpy as np

class KalmanFilter:
    def __init__(self, initial_position, uncertainty):
        self.state = initial_position      # Best estimate of position
        self.uncertainty = uncertainty     # Confidence in that estimate
        
    def predict(self, velocity, dt, process_noise):
        """Predict next state based on motion model"""
        # Physics: new_position = old_position + velocity * time
        self.state = self.state + velocity * dt
        # Uncertainty increases when we predict (more room for error)
        self.uncertainty += process_noise
        
    def update(self, measurement, measurement_noise):
        """Correct estimate based on sensor measurement"""
        # Calculate how much to trust measurement vs prediction
        # If sensor is very noisy, trust prediction more
        # If sensor is accurate, trust measurement more
        
        if self.uncertainty + measurement_noise > 0:
            confidence = self.uncertainty / (self.uncertainty + measurement_noise)
        else:
            confidence = 0.5
            
        # Blend prediction with measurement
        self.state = (1 - confidence) * self.state + confidence * measurement
        
        # Update uncertainty
        self.uncertainty = self.uncertainty * (1 - confidence)
        
    def get_state(self):
        return self.state

# Example usage:
kf = KalmanFilter(initial_position=0.0, uncertainty=1.0)

# Tick 1: Predict
kf.predict(velocity=0.1, dt=1.0, process_noise=0.5)  # Moving forward
print(f"Predicted: {kf.state}")  # ~0.1

# Tick 1: Measurement from camera
kf.update(measurement=0.12, measurement_noise=0.2)  # Camera sees 0.12
print(f"Updated: {kf.state}")  # Blend of prediction and measurement

# Tick 2: Predict
kf.predict(velocity=0.1, dt=1.0, process_noise=0.5)
print(f"Predicted: {kf.state}")

# Tick 2: Measurement from lidar
kf.update(measurement=0.20, measurement_noise=0.05)  # Lidar sees 0.20 (more accurate)
print(f"Updated: {kf.state}")  # Trust lidar more
```

### Kalman Filter Visualization

```
Time 0: Initial position = 0m, uncertainty = ±1m
        [─────●─────]  (wide uncertainty)

Time 1: Predict movement + measurement
        [──●──]  (narrower, sensors agree)

Time 2: More data confirms
        [─●─]  (even more confident)

Time 3: Sensor disagrees? Blend based on confidence
        [──●──]  (trust confident sensor more)
```

## Multi-Sensor Fusion Example: Robot Localization

Real-world scenario: A mobile robot localizing in an indoor building

```
Available sensors:
- Camera: Can see distinctive locations (doors, artwork)
- Lidar: 360° scan of walls and obstacles
- GPS: Works outdoors, fails indoors
- Wheel odometry: Tracks wheel rotation
- IMU: Inertial measurement (accelerometer, gyro)

Fused approach:
```

**Room 1: GPS Available (Parking lot)**
```
GPS: (100m E, 50m N) ± 5m    ← Primary (most accurate outdoors)
Lidar: (100m, 50m) ± 1m      ← Confirms GPS
Odometry: Drift of 0.5m      ← Tracks local motion
Result: Robot trusts GPS, uses lidar for fine details
```

**Room 2: GPS Lost (Indoors)**
```
Lidar: (10m W, 20m N) ± 0.2m  ← Now primary (very accurate)
Camera: Sees door #203         ← Recognizes location
Odometry: (10.1, 20.05)        ← Consistent
IMU: Detects tilts/stairs      ← Warns of elevation changes
Result: Lidar leads, others confirm, extremely confident
```

**Room 3: All Sensors Confused**
```
Lidar: Featureless hallway (many possible locations)
Camera: Identical walls everywhere
Odometry: Position = X (but uncertain)
Result: Use ensemble of previous good estimates
        Move until seeing distinctive feature
```

## Extended Kalman Filter (EKF)

Standard Kalman Filter assumes **linear** relationships (A + B = C).

Real robotics often has **nonlinear** motion (circular movements, rotation).

Extended Kalman Filter handles nonlinearity:

```
Standard KF: New position = Old + velocity (linear)
EKF: New position = Old + velocity + rotation effects (nonlinear)
```

**Trade-off:**
- More accurate for nonlinear systems
- Slightly more complex
- Requires computing Jacobian matrices (local gradients)

## Particle Filter: Alternative Approach

When nonlinearity is extreme, use Particle Filter:

```
Standard KF: Maintains single "best guess"
Particle Filter: Maintains hundreds of hypotheses

Visualization:
┌──────────────────┐
│ □ □ □ □ □ □ □ □ │
│ □ ● ● ● ● ● □ □ │
│ □ ● ● ● ● ● □ □ │
│ □ □ □ □ □ □ □ □ │
└──────────────────┘
Each ● is a possible position
Darker = more likely
```

**Advantages:**
- Handles extreme nonlinearity
- Elegant mathematical framework
- Naturally handles multiple hypotheses

**Disadvantages:**
- Computationally expensive
- Needs many particles (100s-1000s)
- Prone to "particle depletion" (all particles collapse to one)

## Practical Fusion Example: Autonomous Vehicle

Highway driving scenario:

**Sensor Data Stream (100 Hz):**

```
Time 0.00s:
├─ Lidar: Object 2m ahead, closing at 5 m/s
├─ Radar: Object velocity 60 mph (same direction)
├─ Camera: Car brake lights visible
├─ GPS: 37.7749°N, 122.4194°W ± 2m
└─ IMU: Acceleration 0.1g forward

Fused interpretation:
  Car ahead braking, distance closing
  Plan: Brake gently, maintain safe distance
```

**Time 0.10s:**
```
├─ Lidar: 1.8m ahead now (changed!)
├─ Radar: Object velocity now 58 mph (decelerating)
├─ Camera: Brake lights still on
├─ GPS: ± 2.5m (accuracy degrading)
└─ IMU: Acceleration now 0.3g (our car braking harder)

Fused interpretation:
  That car is BRAKING (deceleration detected)
  Confidence: Very high (multiple sensors agree)
  Action: Brake harder
```

## Challenges in Real Sensor Fusion

### Challenge 1: Sensor Synchronization

Different sensors run at different rates:
- Camera: 30 Hz (every 33ms)
- Lidar: 10 Hz (every 100ms)
- GPS: 1 Hz (every 1000ms)

**Solution:**
```python
# Synchronize on earliest timestamp
latest_camera_reading = buffers['camera'][-1]  # Most recent
latest_lidar_reading = buffers['lidar'][-1]

if timestamps_close(latest_camera_reading, latest_lidar_reading):
    fuse(latest_camera_reading, latest_lidar_reading)
else:
    # Use older reading that matches timing
    # Or interpolate between readings
```

### Challenge 2: Sensor Failure

Sensors can fail:
- Camera gets dirty
- GPS loses signal
- Lidar returns NaN
- Sensor disconnects

**Solution:**
```python
def fuse_with_failure_handling(measurements):
    valid_measurements = []
    for sensor_name, measurement in measurements.items():
        if is_valid(measurement) and sensor_health[sensor_name] > threshold:
            valid_measurements.append(measurement)
        else:
            # Ignore this measurement, rely on others
            continue
    
    return fuse(valid_measurements)
```

### Challenge 3: Changing Uncertainty

Sensor noise isn't constant:
- Camera works great in daylight, terrible at night
- Lidar struggles in fog or rain
- GPS better in open areas, worse downtown

**Solution:**
```python
# Adapt uncertainty based on conditions
if is_nighttime():
    camera_uncertainty *= 5  # Less trust in camera
if is_raining():
    lidar_uncertainty *= 3  # Less trust in lidar
```

## Simple vs. Complex Fusion

### Simple: Weighted Average

```python
# When sensors measure same thing
result = (measurement1 * weight1 + measurement2 * weight2) / (weight1 + weight2)

# For position from two cameras:
position = (pos_cam1 * 0.6 + pos_cam2 * 0.4)  # Trust camera 1 more
```

**When to use**: Simple measurements, comparable sensor types

### Medium: Kalman Filter

```python
# What we covered above
# Use when: Multiple sensors, varying uncertainty, some nonlinearity
```

**When to use**: Most robotics applications

### Complex: Particle Filter or Advanced Methods

```python
# Multiple hypotheses, extreme nonlinearity
# Monte Carlo, Bayesian networks, etc.
```

**When to use**: Challenging environments, many possible states

## Testing Sensor Fusion

How to know if your fusion is working:

```python
# Ground truth comparison
true_position = get_ground_truth()  # From external tracking system
estimated_position = sensor_fusion()

error = abs(true_position - estimated_position)
print(f"Mean error: {np.mean(error)}")
print(f"Max error: {np.max(error)}")
print(f"Confidence interval: {np.std(error)} ± {np.percentile(error, 95)}")

# Good fusion should have:
# - Low mean error
# - Tight confidence intervals
# - Consistency across conditions
```

## Summary

Sensor fusion combines multiple imperfect sensors into one robust perception system. Key points:

1. **Complementary sensors**: Different sensors excel at different tasks
2. **Uncertainty is crucial**: Model what you don't know
3. **Kalman Filter**: Simple, effective standard approach
4. **Adapt to conditions**: Sensor quality changes
5. **Test thoroughly**: Compare against ground truth

Well-designed sensor fusion is what enables robots to operate reliably in real-world conditions where individual sensors would fail.

---

**Previous:** [Computer Vision Essentials](./03-computer-vision.md) | **Next:** [Motion and Control](./05-motion-control.md)
