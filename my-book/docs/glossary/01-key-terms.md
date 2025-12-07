---
title: "Key Terms and Definitions"
description: "Comprehensive glossary of Physical AI, robotics, and prompt engineering terminology."
keywords:
  - "glossary"
  - "terminology"
  - "definitions"
  - "reference"
---

# Key Terms and Definitions

## Overview

This glossary defines key terms used throughout the textbook. Organized alphabetically for easy reference.

---

## A

**Activation Function**
A mathematical function applied to neuron outputs to introduce non-linearity. Examples: ReLU, sigmoid, tanh. Essential for neural networks to learn complex patterns.

**Actuator**
Physical device that converts electrical signals into mechanical motion. Examples: electric motors, servo motors, pneumatic cylinders. Enable robots to interact with environment.

**Autonomous**
Capable of operating without human intervention. Robots operate autonomously when they perceive environment and make decisions independently.

**Autonomous Vehicle**
Vehicle that navigates and drives itself without human driver. Uses sensors, perception, and planning to reach destinations safely.

## B

**Backpropagation**
Training algorithm that computes gradients by propagating errors backward through neural network layers. Enables efficient learning of deep networks.

**Baseline**
Known performance level used for comparison. Essential for evaluating if new methods actually improve over existing approaches.

**Bias (ML)**
Systematic error in model predictions. Can arise from training data, model architecture, or measurement errors. Distinct from bias in fairness (prejudicial treatment).

**Bias (Neural Network)**
Learnable parameter in neural network neurons. Allows network to shift activation function, increasing model flexibility.

**Bounding Box**
Rectangular frame around detected object in image. Defined by (x, y, width, height) or corner coordinates. Standard output of object detection models.

## C

**Calibration**
Process of adjusting system to ensure accurate measurements. Critical for sensors (cameras, IMUs, force sensors) before use in robotics.

**CNN (Convolutional Neural Network)**
Deep learning architecture using convolutional layers. Excels at image recognition, computer vision, and spatial pattern detection.

**Chain-of-Thought (CoT)**
Prompting technique that asks model to explain reasoning step-by-step before final answer. Significantly improves accuracy on complex reasoning tasks.

**Collision Avoidance**
Robot behavior preventing unintended contact with obstacles or people. Usually implemented through sensor feedback and safety margins.

**Cobot**
Collaborative robot designed to work safely alongside humans. Force-limited, slower than traditional industrial robots, easier to program.

## D

**DOF (Degrees of Freedom)**
Number of independent ways object can move. 6-DOF arm can translate (x,y,z) and rotate (pitch, roll, yaw). Determines manipulation capability.

**Dataset**
Collection of training examples used to teach machine learning models. Quality and diversity of dataset strongly influences model performance.

**Deep Learning**
Machine learning using neural networks with multiple layers. Enables learning complex hierarchical features from raw data.

**Deterministic**
System behavior completely determined by initial conditions and inputs. Opposite of stochastic. Most robot control is deterministic for predictability.

## E

**Embedding**
Numerical representation of data (text, image, object) as vector in high-dimensional space. Enables semantic understanding and similarity comparisons.

**Encoder-Decoder**
Neural network architecture with two parts: encoder (compresses input) and decoder (generates output). Used in machine translation, image generation.

**End-Effector**
Tool attached to robot arm (gripper, camera, welding torch). Physical component that interacts with environment to accomplish tasks.

## F

**Few-Shot Learning**
Machine learning from limited examples (few examples per class). Contrasts with supervised learning (many examples) and zero-shot (no examples).

**Fine-Tuning**
Training pre-trained model on new specific task. More efficient than training from scratch, requires less data. Common in transfer learning.

**Force Control**
Robot control mode where arm maintains specific force instead of position. Important for manipulation tasks requiring force feedback.

**Forward Kinematics**
Computing end-effector position from joint angles. Straightforward calculation. Opposite of inverse kinematics.

## G

**Generalization**
Model's ability to perform well on new, unseen data. Training on specific dataset doesn't guarantee generalization to real-world variations.

**Gazebo**
Open-source physics simulator for robots. Integrates with ROS, enables testing without real hardware. Fundamental tool for robot development.

**Grasp**
Robot hand configuration gripping an object. Successful grasp allows picking and manipulating. Grasp planning is active research area.

**Ground Truth**
Correct, verified answer used to evaluate model accuracy. In supervised learning, labels are ground truth. In robotics, measured real-world state.

## H

**Hallucination**
Language model generating plausible-sounding but false information. Critical issue in deploying LLMs for safety-critical applications.

**Haptic**
Relating to touch sensation. Haptic feedback returns force information to operator (e.g., force-feedback joystick). Important for teleoperation.

**Hyperparameter**
Configuration setting chosen before training (learning rate, batch size, network depth). Different from parameters (weights learned during training).

## I

**Inference**
Using trained model to make predictions on new data. Opposite of training. Inference typically requires less computation than training.

**Inverse Kinematics**
Computing joint angles to achieve desired end-effector position. More complex than forward kinematics. Essential for robot path planning.

**IMU (Inertial Measurement Unit)**
Sensor measuring acceleration and angular velocity. Used for orientation estimation, motion tracking, balance control.

## J

**Joint**
Connection between two robot links allowing rotation or sliding. Rotating joint (revolute) versus sliding joint (prismatic) have different properties.

**Jetson**
NVIDIA edge AI computing platform. Popular in robotics for onboard deep learning inference. Jetson Nano is accessible entry point.

## K

**Kalman Filter**
Probabilistic algorithm fusing sensor measurements to estimate system state. Optimal for linear systems, Extended Kalman Filter for nonlinear systems.

**Kernel**
Core operation in convolutional layers—small matrix that slides across input computing feature maps. Enables CNNs to detect local patterns.

**Keypoint**
Distinctive point in image (corners, joints in body, landmarks on face). Used in object recognition, pose estimation, visual tracking.

## L

**LLM (Large Language Model)**
Deep learning model trained on huge text corpus. GPT-4, Claude, Gemini are examples. Enables natural language understanding and generation.

**Loss Function**
Function measuring how poorly model performs on training data. Training minimizes loss through optimization (gradient descent).

**LIDAR (Light Detection and Ranging)**
Active sensor emitting laser pulses, measuring time-of-flight. Creates 3D point clouds of environment. Standard on autonomous vehicles.

## M

**Manipulation**
Robot performing complex physical tasks (grasping, assembling, cleaning). Requires perception, planning, and precise control. Frontier of robotics.

**Model Predictive Control (MPC)**
Control method predicting future state trajectories and optimizing control inputs. Enables handling constraints and multi-step planning.

**Multimodal**
AI system processing multiple types of input (text + image, audio + text). Vision-language models are multimodal, combining perception and language.

## N

**Neural Network**
Computing system inspired by biological neurons. Connected neurons processing information through weighted connections (weights, biases).

**Neuron**
Basic unit in neural network. Receives multiple inputs, applies weighted sum plus bias, passes through activation function.

**NMS (Non-Maximum Suppression)**
Post-processing technique removing duplicate detections. Keeps only highest-confidence bounding box when multiple boxes overlap same object.

## O

**Object Detection**
Computer vision task locating and classifying objects in images. Output: bounding boxes with class labels and confidence scores.

**Optimization**
Process of adjusting model parameters to minimize loss. Common method: gradient descent iteratively adjusting parameters in negative gradient direction.

**ONNX (Open Neural Network Exchange)**
Standardized format for representing neural networks. Enables models trained in one framework (PyTorch) to run in another (TensorFlow).

## P

**PID Control**
Feedback control using Proportional, Integral, Derivative terms. Fundamental control algorithm used in motors, temperature control, navigation.

**Point Cloud**
3D representation of space as collection of points with (x,y,z) coordinates. Generated by depth sensors, LIDARs. Used in 3D perception.

**Policy**
In reinforcement learning: function mapping state to action. Robot's policy determines what action to take given current observation.

**Pose**
Position and orientation of object in space. 6-dimensional: (x,y,z,roll,pitch,yaw). Essential for robot localization and manipulation.

**Prompt Engineering**
Crafting input text (prompt) to elicit desired model behavior. Iterative process optimizing clarity, specificity, format for best results.

## Q

**Quaternion**
Mathematical representation of 3D rotation using four numbers (w,x,y,z). Advantages: no gimbal lock, efficient computation, smooth interpolation.

## R

**ROS (Robot Operating System)**
Middleware platform for robot development. Provides communication (topics, services), tools, and ecosystem. Industry standard for research robotics.

**Reinforcement Learning**
Machine learning where agent learns through trial-and-error feedback. Agent takes actions, receives rewards, learns to maximize cumulative reward.

**Reward**
Numerical signal indicating quality of action in reinforcement learning. Agent's goal: maximize cumulative reward over time.

**RGBD**
Sensor providing RGB color image plus depth information. Combines color perception with 3D structure. Used extensively in robotics.

## S

**Segmentation (Semantic)**
Classifying every pixel in image into categories. Fine-grained perception compared to bounding box object detection.

**SLAM (Simultaneous Localization and Mapping)**
Algorithms enabling robots to build maps while localizing within them. Essential for autonomous navigation in unknown environments.

**Supervised Learning**
Learning from labeled examples (input-output pairs). Model learns mapping from inputs to desired outputs. Requires labeled dataset.

## T

**Tensor**
Multi-dimensional array of numbers. Scalars (0D), vectors (1D), matrices (2D) are tensors. Neural networks operate on tensors.

**Training**
Process of adjusting model parameters to minimize loss on training data. Goal: learn mapping generalizing to new, unseen data.

**Transfer Learning**
Using model pre-trained on large dataset as starting point for new task. Fine-tuning requires less data and training time than learning from scratch.

**Transformer**
Neural network architecture using attention mechanisms to process sequences. Powers modern LLMs and vision transformers.

## U

**Unsupervised Learning**
Learning patterns in data without labels. Clustering and dimensionality reduction are unsupervised tasks.

## V

**Vector**
One-dimensional array of numbers. Can represent direction and magnitude (in robotics: velocity, force vectors).

**Velocity Control**
Robot control mode where you specify joint velocities instead of positions. Enables smooth continuous motion. Opposite of position control.

**Vision Transformer (ViT)**
Transformer architecture applied to image recognition. Divides image into patches, processes as sequence. Often outperforms CNNs.

## W

**Weight**
Learnable parameter in neural network connections. Network learns appropriate weights through training. Adjusted to minimize loss.

**Workspace**
Space that robot end-effector can reach. Defined by robot dimensions, joint limits, link lengths. Critical for task feasibility.

## X

**XYZ (Cartesian Coordinates)**
3D position representation using orthogonal axes. Standard for robot end-effector positioning and spatial reasoning.

## Y

**Yaw**
Rotation around vertical (Z) axis. Combined with pitch (X-axis) and roll (Y-axis) to fully specify orientation (Euler angles).

## Z

**Zero-Shot Learning**
Recognizing concepts without any training examples. Model generalizes from description. Extreme case of transfer learning.

**Zero-Shot Prompt**
Prompt requesting model response to task with no examples. Contrasts with few-shot (examples provided). Tests model's inherent capabilities.

---

## Related Terms by Category

### Perception
- CNN, Segmentation, Keypoint, Object Detection, LIDAR, Camera, RGBD, Point Cloud

### Control
- PID Control, Velocity Control, Force Control, Actuator, Motor, Joint

### Robotics
- Robot, DOF, End-Effector, Workspace, Gripper, Cobot, SLAM, Path Planning

### Machine Learning
- Neural Network, Training, Loss Function, Optimization, Generalization, Overfitting, Transfer Learning

### Prompting
- Prompt, Prompt Engineering, Chain-of-Thought, Few-Shot Learning, Zero-Shot, Hallucination

### Mathematics
- Tensor, Vector, Matrix, Gradient, Derivative, Quaternion

---

**Previous:** [Development Environment Setup](../tools/03-development-environment.md) | **Next:** [References and Resources](../references/01-resources.md)
