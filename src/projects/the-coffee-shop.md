---
title: "The Coffee Shop"
slug: "the-coffee-shop"
date: "2025-02-03"
excerpt: "A full-stack coffee shop website featuring a customer-facing frontend and an admin panel, built during my first year of university."
tags: ["php", "mysql", "html", "css", "university-project"]
github: "https://github.com/kavishkadulshan/the-coffee-shop-"
coverImage: "/images/projects/Gallery/coffeeshop/2.png"
demo: "https://freephotospcrack.kesug.com/index.php"
gallery:
    - "/images/projects/Gallery/coffeeshop/2.png"
    - "/images/projects/Gallery/coffeeshop/1.png"
    - "/images/projects/Gallery/coffeeshop/3.png"
    - "/images/projects/Gallery/coffeeshop/4.png"
    - "/images/projects/Gallery/coffeeshop/5.png"
---
## Overview

The Coffee Shop is a full-stack web application I developed during my first year of university. It was designed to serve as a digital storefront for a cafe, complete with a dynamic menu, a blog, and an administrative backend.

Building this project was my introduction to connecting front-end interfaces with back-end databases. It provided me with foundational experience in web development and server-side scripting, paving the way for the more robust architectural patterns I use today.

## Tech Stack


| Layer          | Technology           |
| -------------- | -------------------- |
| **Frontend**   | HTML5, CSS3          |
| **Backend**    | PHP                  |
| **Database**   | MySQL                |
| **Deployment** | InfinityFree / Kesug |

## Features

* **Customer Storefront:** A responsive public-facing website where users can view the coffee shop's menu, read blog posts, and find contact information.
* **Dynamic Content:** Menu items and blog posts are fetched dynamically from the MySQL database.
* **Content Management System (Admin Panel):** A dedicated `/admin.php` route that allows the shop owner to add, edit, or delete menu items and blog publications.

## Lessons Learned

Looking back at this first-year project with the experience I have now, I can identify several critical areas for improvement which have significantly shaped my current development practices:

**Centralized Database Connections:** In this early build, I created a new, separate database connection directly inside every single PHP file that required one. Today, I understand the DRY (Don't Repeat Yourself) principle and connection pooling; I would instead use a single `db_connect.php` file and include it globally to optimize performance and maintainability.

**Secure Authentication:** The admin panel was built without a robust, secure login system. It exposed the administrative routes without proper session validation or password hashing. This mistake taught me a vital lesson in web security, and implementing secure authentication (using JWTs or secure session cookies) is now my first priority when building administrative features.
