# Task Manager

A full-stack task management application built with microservices architecture.
<img width="1867" height="1000" alt="изображение" src="https://github.com/user-attachments/assets/831c591d-d15a-4782-a2ff-d9e0db0b98a7" />


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

Архитектура (4 контейнера):
1. Frontend (React/Vue + TypeScript)

    Роль: Интерфейс пользователя

    Технологии: React/Vue + Vite, TypeScript, TailwindCSS, Chart.js для графиков

    Что делает:

        Создание/редактирование задач с тегами, приоритетами, дедлайнами

        Drag-and-drop доска (To Do / In Progress / Done)

        Графики аналитики (продуктивность по дням, распределение по тегам)

        Виджет погоды (интеграция с бэкендом)

        Уведомления в реальном времени о действиях (через WebSocket)

2. Backend API (Node.js/Python + PostgreSQL)

    Роль: Основная бизнес-логика и данные

    Технологии: Express.js/FastAPI, TypeScript/Python, Prisma/SQLAlchemy, JWT-аутентификация

    Что делает:

        REST API для CRUD операций с задачами

        Аутентификация/регистрация пользователей

        Расчет аналитики (задачи завершены за неделю, среднее время выполнения)

        Логирование действий

3. Service Worker (Python/Node.js Microservice)

    Роль: Фоновые и сторонние интеграции

    Технологии: Python с FastAPI/Flask или Node.js, Redis для кеша

    Что делает:

        Интеграция с OpenWeatherMap API: Получает погоду для города пользователя (берется из профиля или локации по IP)

        Напоминания: Может проверять дедлайны и формировать очередь уведомлений (хотя отправку можно имитировать)

        Кеширование данных погоды в Redis на 30 минут

4. WebSocket Server (Node.js)

    Роль: Реальное время

    Технологии: Node.js + Socket.io или ws библиотека

    Что делает:

        Рассылает события всем авторизованным клиентам при:

            Создании/завершении задачи

            Изменении статуса задачи

        Отправляет точечные уведомления пользователю (например, "Задача 'Позвонить маме' скоро истекает!")


Дополнительные инструкции в файле extra.txt

## License

MIT
