# ContactHub

A full-stack contact management application built with React, Node.js, Prisma, and PostgreSQL, fully containerized with Docker. Designed for production deployment on Supabase + Render.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + TypeScript + Tailwind CSS |
| Backend | Express + TypeScript |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT (bcrypt + jsonwebtoken) |
| Container | Docker Compose |

## Getting Started (Docker)

Prerequisites: Make sure you have **Docker Desktop** installed and running.

### 1. Configure Environment Variables
Copy the example environment file and configure your credentials:
```bash
cp .env.example .env
```

### 2. Run the Application
Start the frontend, backend, and database services:
```bash
docker compose up --build
```

Once the containers are running, you can access the services at:
* **Frontend**: http://localhost:3000
* **Backend API**: http://localhost:5000
* **PostgreSQL Database**: localhost:5433 (External port for database client access)

### 3. Stopping the Application
To stop all running services:
```bash
docker compose down
```

To stop and completely remove persistent database volumes:
```bash
docker compose down -v
```

---

## Local Development (Without Docker)

If you prefer to run the application locally without containers, you will need Node.js and a local PostgreSQL instance running.

### 1. Install Dependencies
```bash
npm install
cd client && npm install
cd ../server && npm install
```

### 2. Database Setup
Create a `.env` file inside the `server/` directory and set your local database URL:
```env
DATABASE_URL="postgresql://contactuser:contactpass123@127.0.0.1:5433/contact_app"
```

> **Tip:** You can run just the PostgreSQL container for local development:
> ```bash
> docker compose up postgres -d
> ```
> This gives you a PostgreSQL database on port 5433 without running the full stack.

Run Prisma migrations locally:
```bash
cd server && npx prisma migrate dev
```

### 3. Start Development Servers
From the root directory, run both servers concurrently:
```bash
npm run dev
```

---

## Database Migrations

### Creating a New Migration
After modifying `server/prisma/schema.prisma`, generate a migration:
```bash
cd server
npx prisma migrate dev --name describe_your_change
```

### Applying Migrations in Production
Migrations are automatically applied when the Docker container starts via `docker-entrypoint.sh`, which runs:
```bash
npx prisma migrate deploy
```

### Resetting the Database
To wipe all data and re-apply migrations from scratch:
```bash
cd server
npx prisma migrate reset
```

---

## Connecting Supabase for Production

When you're ready to deploy to production, replace the local PostgreSQL with [Supabase](https://supabase.com):

### 1. Create a Supabase Project
Go to [supabase.com](https://supabase.com), create a new project, and copy the connection string from **Settings → Database → Connection string → URI**.

### 2. Set the Production DATABASE_URL
Your Supabase connection string will look like:
```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

Set this as `DATABASE_URL` in your production environment (e.g., Render environment variables).

### 3. Deploy Migrations
Run migrations against your Supabase database:
```bash
DATABASE_URL="your-supabase-connection-string" npx prisma migrate deploy
```

### 4. Deploy the Backend
On [Render](https://render.com), create a new **Web Service** and set:
- **Build Command**: `npm ci && npx prisma generate && npm run build`
- **Start Command**: `npx prisma migrate deploy && node dist/server.js`
- **Environment Variable**: `DATABASE_URL` = your Supabase connection string

> **Note:** When deploying to Render with Supabase, you don't need the Docker PostgreSQL service. The backend connects directly to Supabase's managed PostgreSQL.
