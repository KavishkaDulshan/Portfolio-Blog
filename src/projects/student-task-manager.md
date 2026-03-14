---
title: "Student Task Manager"
date: "2025-01-20"
excerpt: "A web app for managing university assignments, deadlines, and study sessions. Built as a semester project to practice full-stack development."
tags: ["react", "node.js", "express", "sqlite"]
github: "https://github.com/kavishkadulshan/student-task-manager"
coverImage: "https://picsum.photos/seed/taskmanager-cover/1200/630"
---

## Overview

Student Task Manager is a productivity app designed for university students to track assignments, deadlines, and study goals. I built it as a semester project to get hands-on experience with full-stack development.

The problem it solves: most task managers are either too simple (plain to-do lists) or too complex (project management tools built for teams). This one is calibrated for a single student's workflow.

## Features

- **Assignment tracker** — Add assignments with subject, deadline, and priority
- **Deadline calendar** — Visual calendar view with color-coded urgency
- **Study sessions** — Pomodoro-style timer with session logging
- **Progress tracking** — Weekly completion stats

## Architecture

```
client/          ← React frontend
├── src/
│   ├── pages/
│   ├── components/
│   └── hooks/
server/          ← Express API
├── routes/
├── models/
└── db/          ← SQLite database
```

The backend is a simple Express REST API with SQLite for persistence. I chose SQLite specifically because it requires zero infrastructure setup — the database is a single file.

## API design

```http
GET    /api/tasks           → list all tasks
POST   /api/tasks           → create task
PATCH  /api/tasks/:id       → update task
DELETE /api/tasks/:id       → delete task
GET    /api/tasks/upcoming  → tasks due in next 7 days
```

## What I learned

**Data normalisation matters early.** I initially stored everything in one table and ended up rewriting the schema halfway through when I added subjects. Lesson: think about relationships before writing code.

**Optimistic updates improve perceived performance.** Updating the UI immediately and syncing with the server in the background made the app feel much more responsive.

**SQLite is underrated for small projects.** No server to run, no connection pool to manage, transactions work great. For a single-user app, it's a perfect fit.

## Tech stack

| Part | Technology |
|------|-----------|
| Frontend | React + Vite + Tailwind |
| Backend | Node.js + Express |
| Database | SQLite (via better-sqlite3) |
| Deployment | Railway (backend) + Netlify (frontend) |
