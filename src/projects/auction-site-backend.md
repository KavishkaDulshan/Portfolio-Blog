---
title: "Online Auction System — Backend"
slug: "auction-site-backend"
date: "2025-03-16" # Updated to today's date; adjust if needed
excerpt: "A scalable .NET 8 backend for a real-time auction platform, featuring a decoupled repository architecture, SignalR bidding rooms, and JWT security."
tags: [".net", "c#", "mysql", "signalr", "jwt", "rest-api"]
github: "https://github.com/kavishkadulshan/auction_site_backend"
coverImage: "/images/projects/auction-backend-cover.jpg"
---
## Overview

This project is a comprehensive backend solution for an **Online Auction Platform**, developed as a **group assignment for a university project**. The system manages the full auction lifecycle, providing a secure environment for users to list items, manage categories, and participate in competitive bidding.

In this group project, my primary role was to **design the backend architecture and develop and test the core APIs**. I focused on ensuring the system followed industry-standard design patterns to maintain scalability and clean separation of concerns.

## Architecture

The backend is built using a **Layered Architecture** (N-Tier) to ensure modularity and ease of testing. The implementation utilizes the following structural patterns:

* **Repository Pattern:** Decouples the data access layer (Entity Framework Core) from the business logic, using generic and specialized repositories like `IItemRepository` and `IBidRepository`.
* **Service Layer:** Contains the core business logic for auctions, bidding, and image processing, injected into controllers via **Dependency Injection**.
* **Real-time Communication:** Implements **SignalR Hubs** to manage concurrent bidding rooms, allowing for instant broadcast of bid updates to all connected clients.
* **Background Services:** Includes an `AuctionMonitoringService` that runs as a hosted service to automatically handle auction expirations and status transitions.
* **Global Middleware:** A custom `GlobalExceptionMiddleware` ensures consistent error responses across all API endpoints.

## API Design

The API is designed following **RESTful principles**, using standard HTTP methods and status codes for clear communication with the frontend.

### Key Endpoints


| Method | Endpoint                         | Description                                                                   |
| :----- | :------------------------------- | :---------------------------------------------------------------------------- |
| `POST` | `/api/auctions/create`           | Main endpoint for auction creation with multipart image uploads.              |
| `GET`  | `/api/auctions/categories`       | Retrieves all available item categories for frontend selection.               |
| `GET`  | `/api/auctions/duration-options` | Provides valid timeframes for auction listings.                               |
| `WS`   | `/biddingHub`                    | SignalR WebSocket endpoint for real-time bidding updates and room management. |

The system uses **JWT Authentication** to secure these endpoints, requiring a Bearer token for sensitive operations like creating auctions or placing bids.

## Tech Stack


| Layer          | Technology                                   |
| :------------- | :------------------------------------------- |
| **Framework**  | .NET 8.0 (ASP.NET Core)                      |
| **Database**   | MySQL via Pomelo Entity Framework Core       |
| **Real-time**  | SignalR (WebSockets)                         |
| **Security**   | JWT Authentication & BCrypt Password Hashing |
| **Validation** | FluentValidation                             |
| **API Docs**   | Swagger / OpenAPI                            |

## Features

* **Real-time Bidding Engine:** Users can join specific auction rooms to receive live notifications when new bids are placed.
* **Multi-part File Handling:** Supports the upload of up to 5 images per auction item with automated server-side validation for file size and format.
* **Complex Enum Conversions:** Custom EF Core configuration to handle human-readable status values (e.g., "Pending Review", "Active") in a MySQL database.
* **Automated Lifecycle Management:** Background tasks monitor bid deadlines to transition items from "Active" to "Sold" or "Expired" automatically.

## Lessons Learned

* **Architectural Planning:** Designing the backend architecture from scratch taught me the importance of the Repository pattern in making a large codebase manageable for a group.
* **API Testing Rigor:** Developing and testing APIs for a multi-user environment highlighted the need for strict server-side validation using FluentValidation to prevent data corruption.
* **Concurrency Management:** Implementing SignalR required a deep understanding of how to manage state across multiple client connections in a real-time environment.

---
