---
title: "AI Frameworks and Libraries"
description: "Overview of popular frameworks for building AI systems."
keywords:
  - "frameworks"
  - "deep learning"
  - "TensorFlow"
  - "PyTorch"
---

# AI Frameworks and Libraries

## Overview

Building Physical AI systems requires good tools. This chapter surveys the most important frameworks and libraries for deep learning and robotics.

## Deep Learning Frameworks

### PyTorch

**Strengths:**
- Easy to learn and use
- Pythonic design philosophy
- Strong research community
- Excellent debuggability
- Dynamic computation graphs

**Best for:** Research, prototyping, NLP

**Installation:**
```bash
pip install torch torchvision torchaudio
```

**Example:**
```python
import torch
import torch.nn as nn

class SimpleNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(784, 128)
        self.fc2 = nn.Linear(128, 10)
    
    def forward(self, x):
        x = torch.relu(self.fc1(x))
        return self.fc2(x)

model = SimpleNet()
optimizer = torch.optim.Adam(model.parameters())
```

### TensorFlow

**Strengths:**
- Production-ready
- Excellent documentation
- Scalable training
- Mobile deployment (TensorFlow Lite)
- Industry adoption

**Best for:** Production systems, scaling

**Installation:**
```bash
pip install tensorflow
```

**Example:**
```python
import tensorflow as tf

model = tf.keras.Sequential([
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dense(10)
])

model.compile(
    optimizer='adam',
    loss=tf.keras.losses.SparseCategoricalCrossentropy()
)

model.fit(x_train, y_train, epochs=10)
```

### JAX

**Strengths:**
- Functional programming paradigm
- Automatic differentiation flexibility
- NumPy-like API
- Composable transformations

**Best for:** Research, custom algorithms

**Installation:**
```bash
pip install jax jaxlib
```

## Robotics Frameworks

### ROS (Robot Operating System)

**What it is:** Middleware for robot software

**Core concepts:**
- Nodes: Processes running on robot
- Topics: Message channels
- Services: Request-response communication
- Actions: Long-running tasks

**Installation:**
```bash
# Ubuntu
sudo sh -c 'echo "deb http://packages.ros.org..." > ...'
sudo apt install ros-humble-desktop-full

source /opt/ros/humble/setup.bash
```

**Basic example:**
```python
import rclpy
from geometry_msgs.msg import Twist

class SimpleRobot:
    def __init__(self):
        self.node = rclpy.create_node('simple_robot')
        self.publisher = self.node.create_publisher(
            Twist, '/cmd_vel', 10
        )
    
    def move_forward(self, speed=0.1):
        cmd = Twist()
        cmd.linear.x = speed
        self.publisher.publish(cmd)

rclpy.init()
robot = SimpleRobot()
robot.move_forward()
rclpy.spin(robot.node)
```

### Gazebo Simulator

**Purpose:** Test robots before hardware

**Features:**
- Physics simulation
- Multiple robots
- Pre-built worlds
- Sensor simulation
- Integration with ROS

**Typical workflow:**
1. Launch Gazebo
2. Spawn robot in world
3. Write control code
4. Test behavior
5. Debug as needed

## Computer Vision Libraries

### OpenCV

**Core capabilities:**
- Image processing
- Object detection (cascade classifiers)
- Feature matching
- Video processing

**Example:**
```python
import cv2

# Read image
img = cv2.imread('image.jpg')

# Detect faces
faces = cv2.CascadeClassifier(
    'haarcascade_frontalface_default.xml'
).detectMultiScale(img, 1.3, 5)

# Draw boxes
for (x,y,w,h) in faces:
    cv2.rectangle(img, (x,y), (x+w,y+h), (255,0,0), 2)

cv2.imshow('Faces', img)
cv2.waitKey(0)
```

### MediaPipe

**What it does:** Multi-modal perception tasks

**Capabilities:**
- Pose estimation
- Hand tracking
- Face detection
- Body segmentation
- Object detection

**Example:**
```python
import cv2
import mediapipe as mp

mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

cap = cv2.VideoCapture(0)
while cap.isOpened():
    ret, frame = cap.read()
    results = pose.process(frame)
    
    if results.pose_landmarks:
        # Process landmarks
        pass
```

## Data Tools

### NumPy

Essential for numerical computing:
```python
import numpy as np

# Array operations
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
c = a + b  # Element-wise addition

# Matrix operations
A = np.random.randn(10, 5)
B = np.random.randn(5, 3)
C = A @ B  # Matrix multiplication
```

### Pandas

Essential for data manipulation:
```python
import pandas as pd

# Load data
df = pd.read_csv('data.csv')

# Filter
filtered = df[df['age'] > 30]

# Group and aggregate
grouped = df.groupby('category')['value'].mean()
```

## Development Tools

**Jupyter Notebooks**
- Interactive exploration
- Visualization
- Documentation combined with code

**VS Code with Python extension**
- Professional development
- Debugging
- Git integration

**Git and GitHub**
- Version control
- Collaboration
- Open source contribution

## Summary

Successful AI projects combine:
- **Frameworks** (PyTorch/TensorFlow) for models
- **Robotics tools** (ROS, Gazebo) for systems
- **Vision libraries** (OpenCV, MediaPipe) for perception
- **Data tools** (NumPy, Pandas) for processing

Each tool excels at specific tasks. Learn the fundamentals, master one framework deeply, then expand.

---

**Previous:** [Ethical Considerations](../applied-ai/05-ethics.md) | **Next:** [Robotics Platforms and Simulators](./02-robotics-platforms.md)
