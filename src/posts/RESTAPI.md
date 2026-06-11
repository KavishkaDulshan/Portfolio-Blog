---
title: "Understanding REST APIs: The Messengers of the Internet"
date: "2026-06-11"
excerpt: "A beginner-friendly guide to REST APIs. Learn how they work, the essential HTTP methods, and the core principles of REST architecture."
tags: ["api", "rest-api", "web-development", "backend", "software-architecture"]
coverImage: "/images/blog/RESTAPI/image.webp"
---
A REST API (Representational State Transfer Application Programming Interface) is a set of rules and conventions that allows different software applications to communicate with each other over the internet.

To break that down: an API is the messenger that takes a request from one system, tells another system what to do, and returns the response. REST is a specific architectural style (a set of guidelines) for how those APIs should be built.

## The Restaurant Analogy

Imagine you are sitting at a restaurant.

* **You** are the **Client** (a web browser or mobile app).
* The **Kitchen** is the **Server** (where the database and logic live).

You can't just walk into the kitchen and grab your food. You need a **Waiter**, which is the **API**.

You give your order (a request) to the waiter, the waiter takes it to the kitchen, and the kitchen gives the waiter your food to bring back to you (the response). A REST API just means the waiter is following a very specific, standardized set of rules to do this job.

## How It Works: The HTTP Methods

REST APIs use standard web protocols (HTTP) to perform actions on data. In the software world, we often call this CRUD (Create, Read, Update, Delete). Here are the primary methods a REST API uses:

* **GET (Read):** Retrieves data from the server.
  * *Example:* Loading your Instagram feed or asking a weather API for the current temperature.
* **POST (Create):** Sends new data to the server to create a new record.
  * *Example:* Publishing a new tweet or creating a new user account.
* **PUT / PATCH (Update):** Modifies existing data on the server.
  * *Example:* Changing your profile picture or updating your shipping address.
* **DELETE (Delete):** Removes data from the server.
  * *Example:* Deleting an old post or removing an item from your shopping cart.

## Key Principles of REST

If an API is truly "RESTful," it must adhere to several design principles. The two most important are:

### Client-Server Separation

The client interface (the app you see) and the server/data storage (the backend) are completely separate. This means developers can work on the mobile app without worrying about breaking the database, as long as the API bridge between them remains consistent.

### Statelessness

The server does not store any information about the client's past requests. Every single request you send to the server must contain all the information needed to understand and process it. Think of it like someone with short-term memory loss; you have to re-introduce yourself and explain exactly what you want every single time you talk to them.

## What Does It Look Like?

Data in a REST API is organized into resources, which are accessed via specific URLs called endpoints.

When a client sends a request to an endpoint (e.g., a GET request to `https://api.spotify.com/v1/albums`), the server typically responds with data formatted in JSON (JavaScript Object Notation), which is a lightweight text format that is easy for humans to read and machines to parse.

- Kavishka Dulshan
