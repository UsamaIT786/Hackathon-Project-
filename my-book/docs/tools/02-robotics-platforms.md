---
title: "Robotics Platforms and Simulators"
description: "Hands-on platforms for learning and building robots."
keywords:
  - "robotics"
  - "platforms"
  - "simulators"
  - "hardware"
---

# Robotics Platforms and Simulators

## Overview

Learning robotics requires hands-on experience. This chapter surveys accessible platforms and simulators for building real and simulated robots.

## Hardware Platforms

### TurtleBot3

**Best for:** Beginners

**What you get:**
- Wheeled mobile robot
- LIDAR for navigation
- Camera for perception
- Open source design
- Active community

**Cost:** $200-600 depending on model

**Capabilities:**
- Autonomous navigation
- SLAM mapping
- Obstacle avoidance
- Custom software

**Getting started:**
```bash
# Install ROS 2 and TurtleBot3
sudo apt install ros-humble-turtlebot3*

# Launch simulation
ros2 launch turtlebot3_gazebo turtlebot3_world.launch.py

# Create your control code
ros2 topic pub /cmd_vel geometry_msgs/Twist \
  "linear: {x: 0.2}" --rate 10
```

### Jetson Nano

**Best for:** AI on edge

**Specs:**
- CPU: Quad-core ARM 64-bit
- GPU: NVIDIA Maxwell (128 CUDA cores)
- RAM: 2-4GB
- Cost: $99-149

**Use cases:**
- Robot brain
- Computer vision at edge
- Real-time inference
- Onboard deep learning

**Setup:**
```bash
# Install NVIDIA Jetpack (OS and libraries)
# Then install AI frameworks
pip3 install torch torchvision
pip3 install tensorflow

# Example: Real-time object detection
python3 detect_objects.py --model yolov8n
```

### Raspberry Pi

**Best for:** Learning, cost-sensitive projects

**Options:**
- Pi 4: 2-8GB RAM, good performance
- Pi 5: Latest, faster processor
- Pi Zero: Minimal, embedded use

**Common robot kits:**
- ROSbot (with ROS pre-installed)
- PiBit (with sensors)
- Custom builds with motor control

### Boston Dynamics Spot

**Best for:** Advanced research/industry

**Capabilities:**
- Quadruped locomotion
- Climbing stairs
- Perception suite
- Manipulation
- Open API

**Cost:** $75,000+ (expensive but available)

## Simulation Platforms

### Gazebo

**What it is:** Physics-based simulator

**Strengths:**
- Free and open source
- Realistic physics
- Plugin system
- ROS integration
- Large community

**Worlds included:**
- Office environments
- Outdoor scenes
- Warehouse layouts

**Example:**
```xml
<?xml version="1.0"?>
<sdf version="1.6">
  <world name="warehouse">
    <physics type="ode">
      <gravity>0 0 -9.81</gravity>
    </physics>
    
    <include>
      <uri>model://ground_plane</uri>
    </include>
    
    <model name="my_robot">
      <pose>0 0 0 0 0 0</pose>
      <link name="base_link">
        <!-- Robot definition -->
      </link>
    </model>
  </world>
</sdf>
```

### CoppeliaSim (V-REP)

**What it is:** Versatile physics simulator

**Strengths:**
- Powerful physics engine
- Beautiful visualization
- Multi-platform
- Python/Lua scripting
- Educational focus

**Features:**
- Built-in robots
- Physics variations (ODE, Bullet, Newton)
- Inverse kinematics
- Path planning

### IsaacSim

**What it is:** NVIDIA's AI-ready simulator

**Strengths:**
- Based on Omniverse
- Photorealistic rendering
- AI/ML integration
- Physics accuracy
- Sim-to-real transfer

**Use cases:**
- Training perception models
- Validating robot behaviors
- Testing in diverse conditions

## Choosing Your Platform

**Learning robotics?**
→ Start with TurtleBot3 + Gazebo simulator

**Want to explore AI?**
→ Use Jetson Nano with camera + PyTorch

**Building custom robot?**
→ Raspberry Pi + ROS + custom electronics

**Professional development?**
→ Gazebo/IsaacSim for simulation, real hardware as needed

**Advanced research?**
→ Boston Dynamics Spot or similar research platform

## Open Source Communities

**TurtleBot3 Community**
- Forum: https://github.com/ROBOTIS-GIT/turtlebot3
- Wiki: Extensive documentation
- Projects: Real examples

**ROS Community**
- Discourse: Main discussion forum
- Packages: 5000+ available packages
- Companies: Industry backing

**ArduPilot Community**
- Autonomous vehicle firmware
- Drones, boats, rovers
- Simulation support

## Budget Guide

**Minimal ($100-200)**
- Raspberry Pi
- USB camera
- Basic sensors
- Motors + driver

**Beginner ($300-600)**
- TurtleBot3
- Gazebo (free)
- Development computer

**Intermediate ($1000-3000)**
- Custom robot platform
- Jetson Nano for AI
- Professional sensors
- Safety equipment

**Professional ($10,000+)**
- Research-grade robot
- High-quality sensors
- Redundant systems
- Professional support

## Summary

Start with simulators (free, safe), progress to affordable hardware (Raspberry Pi, TurtleBot3), then scale to professional platforms. Each level teaches different lessons and skills.

---

**Previous:** [AI Frameworks and Libraries](./01-frameworks.md) | **Next:** [Development Environment Setup](./03-development-environment.md)
