# Ledger — MERN Expense Tracker

A full-stack, production-structured expense tracking system built with **MongoDB, Express, React, and Node.js**.

## Features

- **Auth** — JWT-based register/login (httpOnly cookie + bearer token support), password hashing with bcrypt, profile management, password change.
- **Transactions** — full CRUD for expenses/income with search, filters (category, type, payment method, date range, amount range), sorting, and pagination. Supports tags, notes, recurring flags, and payment methods.
- **Categories** — custom categories per user (icon + color), seeded with sensible defaults on signup, protected from deletion while in use.
- **Budgets** — monthly per-category budgets with live spent/remaining tracking and progress bars.
- **Reports & Dashboard** — income vs. expense trend (area chart), category breakdown (pie chart), 12-month bar chart, top categories, recent activity feed, KPI cards.
- **Security** — helmet, rate limiting, mongo-sanitize, xss-clean, centralized error handling, input validation.
- **Design** — a distinctive "ledger book" visual identity (ink navy + warm gold/rust palette, Fraunces/Inter/JetBrains Mono type, receipt-stub transaction rows), fully responsive with a mobile drawer nav.

## Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
**Frontend:** React 18, Vite, React Router, Tailwind CSS, Recharts, Axios, react-hot-toast, lucide-react

## Project Structure

```
expense-tracker/
├── backend/
│   ├── config/db.js
│   ├── models/          # User, Category, Expense, Budget
│   ├── controllers/      # auth, expense, category, budget, report
│   ├── routes/
│   ├── middleware/       # auth (JWT), errorHandler
│   ├── utils/generateToken.js
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── context/AuthContext.jsx
    │   ├── components/    # Sidebar, Topbar, AppLayout, ExpenseForm, ExpenseStub, Modal, etc.
    │   ├── pages/          # Login, Register, Dashboard, Expenses, Categories, Budgets, Reports, Settings
    │   └── App.jsx
    ├── tailwind.config.js
    └── vite.config.js
```

## Prerequisites

- Node.js 18+
- MongoDB running locally (`mongod`) or a MongoDB Atlas connection string

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env — at minimum set MONGO_URI and JWT_SECRET
npm run dev
```

The API starts on `http://localhost:5000`. Health check: `GET /api/health`.

**Important:** generate a strong `JWT_SECRET` before running anything beyond local testing, e.g.:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app starts on `http://localhost:5173` and proxies `/api` requests to the backend automatically (see `vite.config.js`).

### 3. Try it out

1. Open `http://localhost:5173/register` and create an account.
2. A default set of expense/income categories is created automatically.
3. Add transactions, set monthly budgets, and explore the dashboard/reports.

## Production Build

```bash
cd frontend
npm run build
```

Set `NODE_ENV=production` in the backend `.env` and start the backend — `server.js` will serve the built frontend from `frontend/dist` automatically, so you can deploy backend + frontend as a single Node process. Alternatively, deploy the frontend separately (Vercel/Netlify) and the backend to any Node host (Render, Railway, EC2, etc.), pointing `CLIENT_URL` in the backend `.env` to your deployed frontend origin for CORS.

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET/PUT | `/api/auth/me` | Get/update profile |
| PUT | `/api/auth/change-password` | Change password |
| GET/POST | `/api/expenses` | List (filter/search/paginate) / create |
| GET/PUT/DELETE | `/api/expenses/:id` | Read / update / delete |
| POST | `/api/expenses/bulk-delete` | Delete multiple |
| GET/POST | `/api/categories` | List / create |
| PUT/DELETE | `/api/categories/:id` | Update / delete |
| GET/POST | `/api/budgets` | List for month / upsert |
| DELETE | `/api/budgets/:id` | Delete |
| GET | `/api/reports/summary` | Dashboard KPIs |
| GET | `/api/reports/trend` | Income/expense trend series |
| GET | `/api/reports/category-breakdown` | Pie chart data |

All routes except `/auth/register` and `/auth/login` require a valid JWT, sent either as an httpOnly cookie (set automatically on login) or as `Authorization: Bearer <token>`.

## Notes on "industry level"

This project follows common production conventions: layered architecture (routes → controllers → models), centralized error handling, environment-based config, security middleware, indexed Mongoose schemas, and a component-based frontend with shared UI primitives and a real design system. For a real deployment you'd want to add: automated tests (Jest/Supertest + React Testing Library), CI/CD, request logging/monitoring (e.g. Sentry), refresh-token rotation, and file storage (S3) for receipt attachments — the `attachmentUrl` field is already scaffolded on the Expense model for that.
