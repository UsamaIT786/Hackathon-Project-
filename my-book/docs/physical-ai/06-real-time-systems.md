---
title: "Real-Time Systems"
description: "Design and implement systems that meet strict timing requirements."
keywords:
  - "real-time"
  - "timing constraints"
  - "deadline"
  - "determinism"
---

# Real-Time Systems

## Overview

A robot has milliseconds—not seconds—to perceive its environment and act. Real-time systems are designed to meet strict timing guarantees. In this chapter, we explore how to build systems where timing is as important as correctness. A correct answer 1 second late might be worse than no answer at all.

## Key Concepts

- **Real-time constraints**: Hard deadlines that must be met
- **Determinism**: Predictable timing, not just fast average
- **Latency**: Time from input to output
- **Jitter**: Variation in timing (bad for real-time)
- **Priority scheduling**: Important tasks run first
- **Real-time operating systems**: OS designed for hard deadlines

## Why Real-Time Matters

### Scenario 1: Autonomous Vehicle

```
Time 0.0s: Sensor detects pedestrian 20m ahead
Time 0.01s: Processing detects danger
Time 0.05s: Decision made: "Brake hard"
Time 0.10s: Braking starts
Time 0.30s: Car stops (30m later)

Problem: If processing takes 0.5s instead of 0.05s:
  Result: Car travels 10m more before stopping
           Collision at 20m instead of safe stop
```

**Timing requirement**: Perception and decision < 100ms

### Scenario 2: Robot Arm Assembly

```
Time 0.0s: Pick up part from tray
Time 0.2s: Move to assembly position (moving)
Time 0.3s: Sensor detects collision!
Time 0.35s: Stop motor (100ms delay due to slow processing)

Problem: By time we detect and stop, arm has bent part
Solution: Process sensor data in < 10ms
          Collision stops motor immediately
```

**Timing requirement**: Control loop closure < 10ms

### Scenario 3: Quadrotor Stabilization

```
Physical reality: Drone is unstable (wants to fall)
Control frequency needed: 200+ Hz (5ms per cycle)

Consequence:
├─ If control loop runs every 5ms: Stable, smooth
├─ If control loop runs every 20ms: Oscillates, unstable
└─ If control loop delays randomly: Crash!
```

**Timing requirement**: Deterministic, high-frequency control

## Real-Time vs. Performance

**Don't confuse these:**

```
Performance: How fast on average
├─ Average: Process 100 frames/second
├─ Metric: Throughput
└─ Goal: High numbers

Real-time: Meeting deadlines
├─ Deadline: Every frame must be done in < 16ms
├─ Metric: % of deadlines met
└─ Goal: 100% compliance, never miss deadline
```

**A real-time system might be:**
- Slow on average but always meets deadline
- Not as fast as possible but guaranteed fast enough

## Hard Real-Time vs. Soft Real-Time

### Hard Real-Time (Safety-Critical)

Missing deadline = failure

Examples:
- **Surgical robot**: Must stop immediately if anomaly detected
- **Autonomous vehicle**: Must brake within guaranteed time
- **Aircraft control**: Must adjust flight surfaces within time window

**Approach:** Prove mathematically that all deadlines are met

### Soft Real-Time (Degraded but Acceptable)

Missing some deadlines acceptable if rare

Examples:
- **Video streaming**: Frame loss annoying, not catastrophic
- **Robot vision**: Skip frame if needed, next frame in 33ms
- **Interactive control**: 50ms delay acceptable, 1s unacceptable

**Approach:** Statistical guarantees, most deadlines met

## Measuring Timing

### Latency

Time from input to output

```
Camera frame arrives: t=0.0s
Processing completes: t=0.05s
Motor command sent: t=0.05s
Motion starts: t=0.07s (delays in motor controller)

End-to-end latency: 0.07s (70ms)
```

### Jitter

Variation in timing

```
Good (low jitter):
  Frame 1: 14ms
  Frame 2: 15ms
  Frame 3: 15ms
  Frame 4: 14ms
  Average: 14.5ms ± 0.5ms

Bad (high jitter):
  Frame 1: 5ms
  Frame 2: 50ms
  Frame 3: 10ms
  Frame 4: 40ms
  Average: 26ms ± 20ms (unpredictable!)
```

**Why jitter matters:**
- Low jitter: Predictable, can plan around
- High jitter: Worst case is very bad, can't compensate

### Worst-Case Execution Time (WCET)

Maximum time an operation can take

```
Average: 10ms
Max observed: 15ms
WCET guarantee: 20ms

Helpful for scheduling:
├─ If task guarantees < 20ms, can trust deadline
└─ Must plan for worst case, not average
```

## Real-Time Scheduling

How to handle multiple time-critical tasks?

### Priority-Based Scheduling

Assign each task a priority; run highest priority task available:

```
Task 1 (Priority 1): Control loop (every 10ms)
Task 2 (Priority 2): Sensor processing (every 20ms)
Task 3 (Priority 3): Logging (whenever time available)

Schedule:
Time 0:   Run Control (priority 1)
Time 10:  Run Control
          Run Sensor (priority 2)
Time 20:  Run Control
Time 30:  Run Control
          Run Sensor
Time 40:  Run Control
          Skip Logging (not enough time)
```

### Deadline Monotonic Scheduling

Shorter deadlines get higher priority

```
Task A: Deadline every 10ms → Priority 1
Task B: Deadline every 50ms → Priority 2
Task C: Deadline every 100ms → Priority 3

Intuition: Tasks with tighter deadlines are more critical
```

### Rate Monotonic Scheduling

Faster tasks get higher priority (if deadline = period)

```
Task A: Runs every 10ms → Priority 1
Task B: Runs every 20ms → Priority 2
Task C: Runs every 50ms → Priority 3
```

## Real-Time Operating Systems (RTOS)

Standard operating systems (Windows, Linux) don't guarantee real-time:
- Time-sharing between applications
- Variable interrupt response
- Garbage collection pauses
- File system access unpredictable

Real-Time OS designed for predictable timing:

### Examples

**VxWorks**: Industry standard, expensive, reliable
**QNX**: Microkernel design, deterministic
**ROS Real-Time Extensions**: Patches Linux for determinism
**CUDA Priority Scheduling**: NVIDIA GPU real-time support

### RTOS Characteristics

- **Deterministic**: Timing is predictable, proven
- **Priority-based**: Importance determines execution order
- **Preemptive**: High-priority task interrupts lower-priority
- **Fast context switching**: Milliseconds to switch between tasks
- **Bounded latency**: Guaranteed maximum interrupt response

## Building Real-Time Systems

### Strategy 1: Use RTOS

Pros:
- Designed for the job
- Proven and tested
- Guarantees provided

Cons:
- Expensive
- Proprietary
- Overkill for some applications

### Strategy 2: Hard Partitioning

```
Core 1 (isolated): Control loop (highest priority)
         ├─ 10ms deadline
         ├─ 1-2ms execution time
         └─ Guaranteed to run

Core 2: Sensor processing
Core 3: Data logging
Core 4: Housekeeping

Result: Control always gets CPU time
        Other tasks don't interfere
```

**Advantages:** Simplicity, guaranteed isolation
**Disadvantages:** Inefficient (CPU might sit idle)

### Strategy 3: Careful Code and Timing Analysis

For soft real-time systems:

```python
import time
import threading

class RealtimeControl:
    def __init__(self, target_frequency=100):
        self.period = 1.0 / target_frequency  # 10ms for 100 Hz
        self.last_time = time.time()
        self.timing_stats = []
        
    def run_loop(self):
        while True:
            start = time.time()
            
            # Critical section (< 5ms)
            self.read_sensors()
            self.compute_control()
            self.send_commands()
            
            # Timing check
            elapsed = time.time() - start
            self.timing_stats.append(elapsed)
            
            if elapsed > self.period:
                print(f"MISSED DEADLINE: {elapsed*1000:.1f}ms")
                # Implement recovery: skip non-critical task
            
            # Sleep remaining time
            sleep_time = max(0, self.period - elapsed)
            time.sleep(sleep_time)
            
            # Track jitter
            if len(self.timing_stats) > 100:
                avg = np.mean(self.timing_stats[-100:])
                std = np.std(self.timing_stats[-100:])
                max_time = np.max(self.timing_stats[-100:])
                print(f"Avg: {avg*1000:.2f}ms, "
                      f"Jitter: ±{std*1000:.2f}ms, "
                      f"Max: {max_time*1000:.2f}ms")
```

## Profiling for Real-Time

Finding where time is spent:

```python
import cProfile
import pstats

# Profile the code
cProfile.run('control_loop()', 'profile_stats')

# Analyze results
stats = pstats.Stats('profile_stats')
stats.sort_stats('cumulative')  # By cumulative time
stats.print_stats(20)  # Top 20 functions

# Output shows:
# ┌──────────────────────────────────────┐
# │ Function        │ Time  │ Time % │
# ├──────────────────────────────────────┤
# │ forward_kinematics │ 2ms  │ 40%  │ ← Biggest cost
# │ collision_check    │ 1.5ms│ 30%  │
# │ sensor_read        │ 1ms  │ 20%  │
# └──────────────────────────────────────┘

# Optimization targets:
# 1. Optimize forward_kinematics (40% of time)
# 2. Optimize collision_check
# 3. Everything else is less important
```

## Common Real-Time Mistakes

### Mistake 1: Trusting Average Case

```
Code runs 10ms average
Deadline: 16ms per frame
Assumption: "Should be fine"

Reality: Occasional memory access → 50ms
         Garbage collection → 100ms
         Result: MISSED DEADLINE
```

**Solution:** Test worst case, use profiling, add safety margin

### Mistake 2: Lock Contention

```
Thread 1 (control):     Waiting for lock!
Thread 2 (sensor):      Has lock for 50ms
Thread 3 (logging):     Waiting for lock!

Result: Control loop blocked
        Deadline missed
```

**Solution:** Minimize critical sections, use lock-free code

### Mistake 3: Unbounded Operations

```python
for item in list:  # What if list has 10,000 items?
    process(item)

if result > threshold:
    loop_through_everything()  # How many iterations?
```

**Solution:** Bound loops, prove max iterations

### Mistake 4: Cache Misses

```
L1 cache hit: 4 cycles
L2 cache hit: 10 cycles
L3 cache hit: 40 cycles
Memory access: 300 cycles

Code with bad locality:
  Access location 1
  Access location 1000
  Access location 2
  Access location 999
  → Cache keeps missing

Result: Unpredictable timing!
```

**Solution:** Careful data layout, memory access patterns

## Testing Real-Time Systems

### Load Testing

```python
# Run system while stressing it
for i in range(1000):
    # Normal operation
    control_loop()
    
    # While also doing:
    heavy_computation()
    disk_io_simulation()
    network_transfer()

# Check if deadlines still met under load
# → If yes, system is robust
# → If no, need optimization
```

### Timing Analysis

```
Method 1: Measurement
  Run 1000x, record execution times
  Analyze distribution
  Problem: Might miss worst case!

Method 2: Mathematical proof
  Analyze code, prove upper bounds
  Combine with hardware specs
  Problem: Very hard for complex code

Method 3: Hybrid
  Measure + safety margin
  Run tests with hardware limitations
  Most practical approach
```

## Future: Time-Sliced Computing

Emerging approach for cloud/edge robotics:

```
Traditional: All processing on robot
Problem: Limited compute, power, cooling

Cloud approach:
├─ Time-critical (control, safety): On robot (hard real-time)
├─ Medium-critical (planning): Edge/cloud (soft real-time)
└─ Low-priority (logging, analysis): Cloud (no deadline)

Challenge: Network latency introduces jitter
Solution: Predictive control, conservative safety bounds
```

## Summary

Real-time systems require different thinking than traditional software:

1. **Deadlines matter**: Miss deadline = failure (or degraded gracefully)
2. **Worst case is what matters**: Average case is irrelevant
3. **Timing is as important as correctness**: Wrong answer on time vs. right answer late
4. **Determinism is key**: Unpredictable jitter is worse than slow but consistent
5. **Test and measure**: Use profiling and load testing to verify

Building reliable robotic systems requires deep understanding of real-time constraints and how to meet them consistently.

---

**Previous:** [Motion and Control](./05-motion-control.md) | **Next Chapter:** [Prompt Engineering Fundamentals →](../prompt-engineering/01-foundations.md)
