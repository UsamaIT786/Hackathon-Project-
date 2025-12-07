---
title: "Development Environment Setup"
description: "Configure your computer for AI and robotics development."
keywords:
  - "setup"
  - "environment"
  - "configuration"
  - "tools"
---

# Development Environment Setup

## Overview

Professional development requires a proper setup. This chapter walks through configuring a computer for Physical AI and robotics work.

## System Requirements

**Minimum:**
- 8GB RAM
- 250GB storage
- Multi-core processor
- Dedicated GPU recommended

**Recommended:**
- 16GB+ RAM
- 500GB+ SSD storage
- Modern multi-core CPU
- NVIDIA GPU (CUDA support)

## Operating System Choice

### Linux (Ubuntu 22.04 LTS)

**Best for:** Robotics development

**Why:**
- ROS native support
- Developer tools mature
- Free
- Community support
- Server deployment

**Installation:**
1. Download Ubuntu 22.04 ISO
2. Create bootable USB
3. Install on system or VM
4. Update: `sudo apt update && sudo apt upgrade`

### Windows with WSL2

**If you must use Windows:**
- Install Windows Subsystem for Linux 2
- Run Ubuntu 22.04 in WSL2
- Most tools work in WSL2

```powershell
# In Windows PowerShell (as admin)
wsl --install -d Ubuntu-22.04

# From then on, use Ubuntu terminal
wsl

# Inside WSL, update
sudo apt update && sudo apt upgrade
```

### macOS

**Supported but less ideal:**
- Some ROS packages missing
- Docker recommended
- Homebrew for package management

## Core Development Tools

### Git

```bash
sudo apt install git

# Configure
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Test
git --version
```

### Python and Virtual Environments

```bash
# Install Python 3.10+
sudo apt install python3.10 python3.10-venv python3-pip

# Create virtual environment
python3.10 -m venv ~/ai-env

# Activate
source ~/ai-env/bin/activate

# Upgrade pip
pip install --upgrade pip
```

### Text Editor/IDE

**VS Code (Recommended)**
```bash
# Install
sudo apt install code

# Install Python extension
# Inside VS Code: Extensions → Python

# Install Pylance for better intelligence
```

**Alternative: PyCharm Community**
- Heavier but feature-rich
- Free community edition available

## Python Dependencies

```bash
# Activate virtual environment first
source ~/ai-env/bin/activate

# Core scientific computing
pip install numpy scipy pandas matplotlib

# Machine learning
pip install scikit-learn

# Deep learning
pip install torch torchvision torchaudio

# Or TensorFlow
pip install tensorflow

# Jupyter for interactive development
pip install jupyter jupyterlab

# Version control tool
pip install gitpython

# Code quality
pip install black flake8 mypy
```

## ROS 2 Installation

```bash
# Set locale
locale  # check for UTF-8

# Setup sources
sudo apt install software-properties-common
sudo add-apt-repository universe

# Add ROS repository
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key -o /usr/share/keyrings/ros-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu $(source /etc/os-release && echo $UBUNTU_CODENAME) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null

# Install ROS 2 Humble
sudo apt update
sudo apt install ros-humble-desktop-full

# Setup environment
echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc
source ~/.bashrc

# Test
ros2 --version
```

## Docker Setup (Optional but Recommended)

Docker isolates environments and makes sharing reproducible:

```bash
# Install Docker
sudo apt install docker.io docker-compose

# Add user to docker group (no sudo needed)
sudo usermod -aG docker $USER
newgrp docker

# Test
docker run hello-world

# Run Ubuntu with ROS pre-installed
docker pull osrf/ros:humble-desktop
docker run -it osrf/ros:humble-desktop bash
```

## GPU Setup (For Deep Learning)

### NVIDIA GPU

```bash
# Check GPU
nvidia-smi

# Install CUDA toolkit
sudo apt install nvidia-cuda-toolkit

# Install cuDNN (for TensorFlow/PyTorch)
# Download from NVIDIA website, then:
sudo cp cudnn-*-archive/include/cudnn.h /usr/local/cuda/include/
sudo cp cudnn-*-archive/lib/libcudnn* /usr/local/cuda/lib64/
```

### Verify Deep Learning GPU Support

```python
# Test PyTorch
python3 -c "import torch; print(torch.cuda.is_available())"

# Test TensorFlow
python3 -c "import tensorflow as tf; print(tf.config.list_physical_devices('GPU'))"
```

## Development Workflow

### Initialize a project
```bash
mkdir ~/ai-robotics-project
cd ~/ai-robotics-project
git init

# Create virtual environment
python3.10 -m venv venv
source venv/bin/activate

# Create structure
mkdir src tests docs
touch README.md requirements.txt
```

### Install dependencies
```bash
# Create requirements.txt
pip install torch opencv-python pyyaml > requirements.txt

# Share with others
# They run: pip install -r requirements.txt
```

### Git workflow
```bash
git add .
git commit -m "Initial commit"
git branch feature/my-feature
git checkout feature/my-feature

# Make changes...

git add .
git commit -m "Add feature"
git checkout main
git merge feature/my-feature
```

## Testing Your Setup

```bash
# Test Python
python3 --version

# Test ROS
ros2 run demo_nodes_cpp talker

# Test deep learning
python3 -c "import torch; print(torch.__version__)"

# Test Gazebo
gazebo --version

# Test OpenCV
python3 -c "import cv2; print(cv2.__version__)"
```

## Troubleshooting

**ROS command not found?**
- Missing `source /opt/ros/humble/setup.bash`
- Add to ~/.bashrc permanently

**Python package import error?**
- Virtual environment not activated
- Package not installed
- Try: `pip list` to check

**Permission denied errors?**
- Run with `sudo` if needed
- Or add user to group

## Summary

A proper development environment enables productivity:
- Ubuntu 22.04 LTS base
- Python virtual environments for isolation
- VS Code for editing
- ROS 2 for robotics
- PyTorch/TensorFlow for AI
- Git for version control
- Docker for reproducibility

Invest time in setup once, save time throughout development.

---

**Previous:** [Robotics Platforms and Simulators](./02-robotics-platforms.md) | **Next:** [Glossary →](../glossary/01-key-terms.md)
