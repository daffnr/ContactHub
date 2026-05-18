# ContactHub

A full-stack contact management application built with React, Node.js, Prisma, and MySQL, fully containerized with Docker.

## Getting Started (Docker)

Prerequisites: Make sure you have Docker Desktop installed and running.

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
* **MySQL Database**: localhost:3309 (External port for database client access)

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

If you prefer to run the application locally without containers, you will need Node.js and a local MySQL instance (such as XAMPP) running.

### 1. Install Dependencies
```bash
npm install
cd client && npm install
cd ../server && npm install
```

### 2. Database Setup
Create a `.env` file inside the `server/` directory and set your local database URL:
```env
DATABASE_URL="mysql://root:@127.0.0.1:3307/contact_app"
```
Run Prisma migrations locally:
```bash
cd server && npx prisma migrate dev
```

### 3. Start Development Servers
From the root directory, run both servers concurrently:
```bash
npm run dev
```
