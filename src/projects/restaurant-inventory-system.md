---
title: "Restaurant Management System - Inventory Module"
slug: "restaurant-inventory-system"
date: "2024-11-15"
description: "A comprehensive inventory management solution for restaurants, featuring real-time stock tracking, waste logging, and low-stock automated alerts."
tags: ["Jakarta EE", "JPA/Hibernate", "MySQL", "Java 22", "Maven"]
github: "https://github.com/kavishkadulshan/inventory-management-system"
excerpt: "Developing a mission-critical inventory sub-system for a restaurant management platform using a modern Jakarta EE 10 stack."
coverImage: "/images/projects/rms-inventory-dashboard.png"
---
## Overview

As part of a university group project of Development Enterprises Applications module, I was responsible for designing and developing the **Inventory Management Module** for a comprehensive Restaurant Management System (RMS). The goal was to move away from manual tracking and provide restaurant managers with a data-driven way to monitor stock levels, record daily usage, and minimize food waste.

This module acts as the "backbone" of the restaurant's operations, ensuring that the kitchen never runs out of essential ingredients while providing financial transparency regarding ingredient costs and usage history.

## UI Design & Experience

The user interface was designed with a focus on utility and speed, ensuring staff can record data quickly during a busy shift.

* **Dashboard-Centric Design**: Utilizes a grid-based layout for high-level metrics like low-stock counts and recent usage logs.
* **Visual Feedback**: Implemented a responsive table system with hover effects and clear action groups (Edit/Delete/Adjust) to improve data management efficiency.
* **Clean Professionalism**: The UI uses a "Bootstrap-inspired" custom CSS framework featuring a fixed navigation system and a neutral, professional color palette (#007bff primary) to maintain focus on the data.

## Tech Stack


| Layer              | Technology                      |
| ------------------ | ------------------------------- |
| **Language**       | Java 22                         |
| **Framework**      | Jakarta EE 10 (Web Profile)     |
| **Controller**     | Jakarta Servlet 6.1             |
| **ORM / Database** | Hibernate 6.4 (JPA) + MySQL 8.0 |
| **Security**       | jBCrypt (Password Hashing)      |
| **Build Tool**     | Maven                           |

## Architecture & File Structure

The project follows the **MVC (Model-View-Controller)** pattern, leveraging **DAOs (Data Access Objects)** and **Services** to ensure a clean separation of concerns.

### Project Structure

```text
RMS/
├── src/main/java/com/restaurant/rms/
│   ├── controller/      ← InventoryServlet (Routing & Logic)
│   ├── dao/             ← InventoryDAO (JPA/EntityManager Operations)
│   ├── model/           ← Entity definitions (InventoryItem, WasteLog)
│   ├── service/         ← Business logic layer
│   └── util/            ← DB connection & Auth utilities
├── src/main/webapp/
│   ├── css/             ← Modular style sheets
│   └── views/           ← JSP templates (Inventory List, Usage Forms)
└── pom.xml              ← Project dependencies (Jakarta, Hibernate)
```
