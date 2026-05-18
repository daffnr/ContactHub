# Full-Stack SaaS Contact Manager Monorepo

A highly-scalable, production-ready full-stack contact management application built with a decoupled monorepo architecture. Featuring a premium glassmorphic dark-mode client dashboard, secure JWT authentication, and a robust relational Express backend with Prisma ORM and MySQL.

## 🚀 Key Features

- **Decoupled Monorepo Architecture**: Clean separation between the React client and the Node.js server.
- **Secure Authentication**: Register, login, and session retention (`/auth/me`) powered by **JSON Web Tokens (JWT)** and **bcrypt** password hashing.
- **Optimized Contacts CRM**: Full CRUD contact cards featuring search, filtering by favorites, and database-level server-side pagination.
- **Debounced Search**: Highly optimized frontend search requests using debouncing hooks to minimize database hits.
- **Glassmorphism Design & Micro-Animations**: Sleek SaaS visual aesthetic tailored with tailored Tailwind HSL color tokens and fluid Framer Motion transitions.
- **Decoupled Relational Constraints**: Schema structure featuring cascading deletions (`onDelete: Cascade`) for relational integrity between users and owned contacts.

---

## 📂 Repository Structure

```text
├── client/                     # Frontend Workspace (Vite + React + TS)
│   ├── src/
│   │   ├── components/         # Reusable atomic UI (Buttons, Inputs, Modals, Skeletons)
│   │   ├── context/            # Global Contexts (AuthContext, ToastContext)
│   │   ├── pages/              # Views (Dashboard, Login, Register)
│   │   ├── services/           # Axios Interceptor with JWT injection
│   │   └── utils/              # Tailwind class mixers (clsx + tailwind-merge)
│   └── tailwind.config.js      # Styling tokens & glassmorphism configurations
│
└── server/                     # Backend Workspace (Node.js + Express + TS)
    ├── src/
    │   ├── controllers/        # Core API logic controllers (Auth, Contacts CRUD)
    │   ├── middlewares/        # JWT Verification, global error catcher, Zod validators
    │   ├── routes/             # Modular Express router mappings
    │   └── types/              # Express Request namespace overrides (express.d.ts)
    ├── prisma/
    │   └── schema.prisma       # MySQL database models
    └── .env                    # Credentials & JWT Secrets
```

---

## 📡 API Endpoints Specification

### Authentication Route (`/api/auth`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Register a new user account | No |
| `POST` | `/login` | Authenticate and obtain JWT token | No |
| `GET` | `/me` | Fetch active user credentials from session | Yes |

### Contacts Route (`/api/contacts`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Fetch all user owned contacts (supports search, favorites, & pagination) | Yes |
| `POST` | `/` | Create a new contact card | Yes |
| `GET` | `/:id` | Fetch details of a single contact | Yes |
| `PUT` | `/:id` | Update details of a contact | Yes |
| `DELETE` | `/:id` | Remove a contact (triggers cascade deletion) | Yes |
| `PATCH` | `/:id/favorite` | Toggle the favorite status of a contact | Yes |

---

## 🛠️ Quick Start Guide

### Prerequisites
- Node.js (v18+)
- MySQL Server (e.g., XAMPP, Laragon, or standalone MySQL Instance)

### 1. Database Setup
1. Configure your database connection in `server/.env`:
   ```env
   DATABASE_URL="mysql://root:password@127.0.0.1:3307/contact_app"
   JWT_SECRET="supersecret_jwt_key_2026_modern_saas"
   PORT=5000
   ```
2. Navigate to the `/server` folder and push your schema models:
   ```bash
   cd server
   npx prisma db push
   ```

### 2. Launch Dev Environment
Install `concurrently` at the root of the project to boot both workspaces in a single terminal call:
1. **Install root monorepo runner**:
   ```bash
   npm install
   ```
2. **Launch Client & Server in parallel**:
   ```bash
   npm run dev
   ```
   *The client dev console is now accessible at `http://localhost:3000` and the Express backend is running on `http://localhost:5000`.*
