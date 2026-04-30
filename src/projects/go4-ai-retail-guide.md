---
title: "Go4: AI-Powered Multimodal Retail Guide"
slug: "go4-ai-retail-guide"
date: "2026-04-30"
description: "A multimodal retail guide mobile application utilizing AI for product searching, personalized recommendations, and location-based discovery."
tags: ["Flutter", "Node.js", "Gemini API", "Docker", "Mobile App"]
github: "https://github.com/kavishkadulshan/Go4-Group-Project"
excerpt: "Bridging the gap between physical retail and digital convenience with a Flutter and Node.js stack powered by Gemini AI and Serper APIs."
coverImage: "/images/projects/Gallery/go4/cover.png"
---
## Overview

**Go4** is a comprehensive, multimodal retail guide mobile application developed as a group project for the Mobile Application Development module. Designed to bridge the gap between physical retail and digital convenience, the system utilizes advanced AI models to provide users with intelligent product searching, personalized recommendations, and real-time mapping capabilities.

The application is split into a scalable, containerized Node.js backend and a cross-platform Flutter frontend, ensuring a seamless and responsive user experience across both Android and iOS devices.


## Team & Collaboration

This application was developed as a comprehensive group project for our Mobile Application Development university module. To manage the complexity of a full-stack AI application, we adopted a professional development workflow, utilizing GitHub for version control, strict feature branching, and peer-reviewed pull requests.

Serving as the Technical Lead and primary repository maintainer, I coordinated the integration of our features and managed the core application infrastructure, while my teammates took ownership of specific functional domains.

**My Core Contributions:**

* **Infrastructure & DevOps:** Initialized the Node.js backend and Flutter frontend architectures. Designed and configured automated CI/CD pipelines using GitHub Actions for Azure VM backend deployment and Android APK generation.
* **Core UI & State:** Developed the foundational `AppShell`, routing configurations, and the global Light/Dark app theme provider.
* **Feature Development:** Built the complete backend and frontend layers for the User Search History and Wishlist modules.
* **Repository Management:** Handled code reviews, resolved merge conflicts, and systematically integrated pull requests to maintain a stable `main` branch.

**Team Contributions:**

* **Recommendations Engine:** A teammate spearheaded the personalized recommendation logic, including the `UserPreferences` schema, Serper API query building, and the `learnFromSearch()` algorithm to dynamically track user brand and price affinities.
* **Search & AI Filtering:** Another member focused on the Gemini AI integration, building the filter extraction services, AI-generated search tags, and the interactive processing UI for active search states.
* **Location & Maps:** Dedicated effort was put into integrating the Google Maps screen, building the frontend location provider, and connecting the `/api/v1/places` backend route.
* **Authentication & Profiles:** The initial frontend file structure, JWT middleware, User models, and Google OAuth routes were successfully implemented to secure the application.
* **Product Enrichment:** A team member successfully managed the product detail screens and the specific Gemini enrichment services that power the application's core product insights.

By dividing the application into these modular domains and communicating effectively through Git, we successfully delivered a complex, multimodal application within the module's timeframe.

## Architecture & Infrastructure

The project follows a decoupled client-server architecture, prioritizing modularity and scalable deployment:

* **Backend API:** A Node.js application responsible for handling core business logic, user authentication, and third-party API integrations.
* **Cross-Platform Client:** A Flutter-based mobile application that consumes the backend services and handles complex UI states across various feature modules.
* **Containerization:** The entire backend ecosystem is orchestrated using Docker, with both standard (`docker-compose.yml`) and production-ready (`docker-compose.prod.yml`) configurations ensuring consistent deployment environments.
* **CI/CD Pipeline:** Automated workflows for deployment and APK release generation are managed via GitHub Actions (`deploy.yml`, `release-apk.yml`).

## Tech Stack


| Layer                    | Technology                                |
| :----------------------- | :---------------------------------------- |
| **Frontend**             | Flutter (Dart), targeting Android and iOS |
| **Backend**              | Node.js (REST API architecture)           |
| **AI & Search Services** | Gemini API, Serper API                    |
| **DevOps**               | Docker, GitHub Actions                    |

## Core Features

Based on the application's underlying architecture, Go4 delivers several key functionalities:

* **Multimodal AI Integration:** The backend features dedicated services for Gemini API integration (`geminiService.js`, `geminiEnrichService.js`, `geminiFilterService.js`) to process complex user queries and intelligently filter results. Additionally, a `transcriptionService.js` indicates support for voice-based or audio-driven input.
* **Intelligent Search & Discovery:** The application leverages the Serper API (`serperService.js`) alongside custom search routes (`search.js`) and product endpoints (`product.js`) to locate items efficiently.
* **Personalization Engine:** A dedicated `preferenceLearningService.js` on the backend works in tandem with user preference models to deliver tailored content via the recommendations route (`recommendations.js`) and frontend screens (`recommendations_screen.dart`).
* **Location & Mapping:** Users can visualize places and retail locations through the backend `places.js` route, rendered on the frontend via an interactive Map module (`map_screen.dart`).
* **User Management & State:** The frontend utilizes comprehensive provider patterns (`auth_provider.dart`, `search_provider.dart`, `wishlist_provider.dart`) to manage user profiles, authentication, search histories, and personal wishlists seamlessly.

## File Structure Highlights

The repository maintains a clean separation of concerns, heavily utilizing modular structures for both the frontend and backend:

```text
Go4-Group-Project/
├── backend/                    ← Node.js API Service
│   ├── Dockerfile              ← Backend container definition
│   ├── middleware/             ← Request interceptors (e.g., auth.js)
│   ├── models/                 ← Data schemas (User, SearchHistory, UserPreferences)
│   ├── routes/                 ← API endpoints (auth, analyze, product, places)
│   └── services/               ← Core AI logic (Gemini, Serper, Transcription)
│
├── frontend/                   ← Flutter Mobile App
│   ├── android/ & ios/         ← Native platform configurations
│   ├── lib/
│   │   ├── core/               ← API clients, routing, and theme utilities
│   │   ├── features/           ← UI Modules (home, map, profile, wishlist, results)
│   │   ├── models/             ← Dart data classes (product, search_tag, history_item)
│   │   └── providers/          ← Application state management
│   └── pubspec.yaml            ← Flutter dependencies
│
├── docker-compose.yml          ← Development orchestration
└── .github/workflows/          ← CI/CD automation pipelines
```
