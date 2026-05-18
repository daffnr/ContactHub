# ContactHub

A simple full-stack contact management application built using React (Vite + TypeScript) and Node.js (Express + TypeScript + Prisma + MySQL).

## Features
- User registration and login (JWT & bcrypt)
- Contact CRUD operations (Create, Read, Update, Delete)
- Search contacts with debouncing
- Filter by favorite contacts
- Dynamic pagination
- Dark mode toggle

## Project Structure
- `client/`: React frontend workspace
- `server/`: Express backend workspace

## How to Run

1. Install dependencies in the root folder:
   ```bash
   npm install
   ```

2. Run both the frontend and backend in parallel:
   ```bash
   npm run dev
   ```
