# Task Manager

A full-stack task management application built with microservices architecture.

## Architecture

- **Frontend**: React + TypeScript + Vite + TailwindCSS + Chart.js
- **Backend API**: Node.js + Express + TypeScript + Prisma + PostgreSQL
- **Service Worker**: Python + FastAPI + Redis (for weather caching)
- **WebSocket Server**: Node.js + Socket.io (for real-time notifications)

## Features

- User authentication and registration
- Task CRUD with tags, priorities, deadlines
- Drag-and-drop Kanban board (To Do / In Progress / Done)
- Analytics charts (productivity by days, tag distribution)
- Weather widget integrated via backend
- Real-time notifications via WebSocket

## Setup

1. Clone the repository
2. Run `docker-compose up -d`
3. Access the app at http://localhost

## Environment Variables

- `OPENWEATHER_API_KEY`: API key for OpenWeatherMap
- `JWT_SECRET`: Secret for JWT tokens
- `DATABASE_URL`: PostgreSQL connection string

## Technologies Used

- Docker & Docker Compose
- PostgreSQL
- Redis
- OpenWeatherMap API

This project was created using vibe-coding with the following prompt:

[Insert the prompt here]

## License

MIT
