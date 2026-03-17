---
title: "Intelligent IoT Boat Control System"
slug: "intelligent-iot-boat-waste-collector"
date: "2025-10-15"
description: "An autonomous-ready IoT vessel designed for aquatic waste collection, featuring a distributed bridge architecture and real-time telemetry."
tags: ["IoT", "Raspberry Pi", "ESP32", "Environmental Tech", "Robotics", "Python"]
github: "https://github.com/KavishkaDulshan/WIFI-Remote-Controller"
excerpt: "Cleaning our waters using IoT: A multi-tier robotic system that bridges high-level navigation with low-level hardware actuation."
coverImage: "/images/projects/iot-boat-v2.png"
---
## Overview

The **Intelligent IoT Boat Control System** is a mission-driven robotics project designed to tackle a growing environmental challenge: floating aquatic waste. The system is engineered to navigate water bodies, identify debris, and utilize a mechanical arm to grab and collect waste.

My role in this project was the end-to-end development of the vessel's functionalities, including the navigation logic, the remote connection bridge, and the hardware integration of sensors and actuators.

## Mission: Aquatic Waste Collection

The choice of a **Raspberry Pi 3B+** as the central hub was strategic. Beyond simple networking, the Pi provides the computational headroom required for future computer vision tasks, allowing the boat to eventually identify floating plastics and debris autonomously to assist in intelligent navigation.

## System Architecture

The project utilizes a distributed "Command-Bridge-Actuator" model to ensure that high-level processing never interferes with real-time motor control.

### 1. The Command Center (PC)

Built using **Python and Pygame**, the dashboard provides a cockpit-view of the boat’s status:

* **Steering Control**: A virtual joystick maps to the rudder servo.
* **Waste Collection Arm**: Sliders control the dual-servo robotic arm used to grab waste.
* **Live Telemetry**: A 3-point ultrasonic array provides a 180° "vision" of the boat's surroundings, visualized in real-time to avoid collisions.

### 2. The Central Bridge (Raspberry Pi 3B+)

The Pi functions as the "Brain" of the operation:

* **Network Hub**: It creates its own WiFi Access Point ("Boat_Controller"), allowing control in areas with no internet.
* **The Bridge**: A Python-based `bridge.py` script intercepts UDP packets from the PC and translates them into Serial (UART) commands for the ESP32.

### 3. The Actuator (ESP32)

The ESP32 acts as the "Nervous System," handling low-level timing:

* **Navigation**: Manages the L298N DC motor driver for propulsion and high-torque servos for steering.
* **Waste Grabbing**: Directly controls the GPIO-linked servos that operate the collection mechanism.
* **Sensing**: Constantly polls the ultrasonic sensors to prevent damage to the hull.

## Hardware & IoT Components


| Category       | Components                                   |
| -------------- | -------------------------------------------- |
| **Compute**    | Raspberry Pi 3B+, ESP32                      |
| **Sensing**    | 3x HC-SR04 Ultrasonic Sensors                |
| **Actuation**  | L298N Motor Driver, MG996R Servos, DC Motors |
| **Networking** | UDP over WiFi, UART Serial Bridge            |

Lessons from the Bench (Hardware Engineering)

This project was a deep dive into the realities of IoT hardware. One of the most significant lessons came from the **"burning of electronic components."** During the prototyping phase, I learned firsthand about the critical importance of:

* **Common Grounding**: Ensuring the Pi and ESP32 share a ground to prevent floating voltages during UART communication.
* **Power Isolation**: Realizing that high-current motors can "back-feed" noise into a microcontroller, necessitating optoisolators or separate power rails for logic and motors.
* **Voltage Logic Levels**: Transitioning between the Pi's 3.3V logic and the 5V requirements of the sensors without frying the delicate GPIO pins.

## Future Intelligent Navigation

With the Raspberry Pi 3B+ already integrated as the bridge, the next phase involves deploying a lightweight **TensorFlow Lite** model. This will enable the boat to distinguish between natural obstacles (like rocks) and target waste (like plastic bottles), making the collection process truly autonomous.
