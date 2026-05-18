# ContactHub

ContactHub is a simple, full-stack contact management application built with React, Node.js (Express), Prisma ORM, and PostgreSQL. The application is fully containerized using Docker for easy local setup.

## Features
- User registration and JWT-based authentication
- Contact management (Create, Read, Update, Delete)
- Search contacts by name, email, or phone number
- Containerized setup for consistent development environments

## Tech Stack
- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database & ORM:** PostgreSQL, Prisma ORM
- **Containerization:** Docker, Docker Compose

---

## Quick Start (With Docker)

### Prerequisites
Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### 1. Setup Environment Variables
Copy `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```

### 2. Run the Stack
Start all services (frontend, backend, database):
```bash
docker compose up --build
```

Once running:
- **Frontend:** `http://localhost:3000`
- **Backend API:** `http://localhost:5000`
- **PostgreSQL Database:** Connected locally on external port `5433`

### 3. Stopping the Stack
To stop the running containers:
```bash
docker compose down
```
To stop and also delete the persistent database volumes:
```bash
docker compose down -v
```

---

## Local Development (Without Docker)

If you prefer to run the services individually without Docker, follow these steps.

### Prerequisites
- Node.js installed
- A running PostgreSQL database instance

### 1. Install Dependencies
Install dependencies in all folders:
```bash
npm install
cd client && npm install
cd ../server && npm install
```

### 2. Configure Backend Environment
Create a `.env` file in the `server` directory and define your `DATABASE_URL` and `JWT_SECRET`:
```env
PORT=5000
JWT_SECRET=your_jwt_secret
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

### 3. Run Migrations
Run Prisma migrations to set up the database tables:
```bash
cd server
npx prisma migrate dev
```

### 4. Start the Application
From the root directory, run both development servers concurrently:
```bash
npm run dev
```
