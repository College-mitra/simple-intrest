# MessMates (Full-stack MVP)

MessMates is a mobile-first shared expense + settlement app for students staying in a mess/lodge.

## Tech Stack
- **Frontend:** React + Tailwind CSS + Vite
- **Backend:** Node.js + Express
- **DB:** MongoDB + Mongoose
- **Auth:** JWT (email/password)
- **Realtime:** Socket.io
- **PDF:** PDFKit

## Implemented Features
- Admin/member role-based group system.
- Admin can add/remove members.
- Members can add expenses, cannot remove/modify records.
- Chat-like activity feed with timestamp + expense cards.
- Real-time notifications for expense/admin actions.
- Settlement generator (equal share, who pays whom).
- PDF settlement report download.
- Reset cycle endpoint (archives current by renaming cycle id).
- Expense filters by member/date.
- Dark mode toggle.

## Project Structure
```text
messmates/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/settlementService.js
│   │   ├── scripts/seed.js
│   │   ├── app.js
│   │   └── server.js
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/client.js
│   │   ├── components/
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/Dashboard.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env.example
└── package.json
```

## Setup Instructions
1. **Install dependencies**
   ```bash
   npm install
   npm run install:all
   ```
2. **Create env files**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
3. **Start MongoDB** (local or Atlas URI in `backend/.env`).
4. **(Optional) Seed demo data**
   ```bash
   npm --prefix backend run seed
   ```
5. **Run app**
   ```bash
   npm run dev
   ```
6. Open frontend at `http://localhost:5173`.

## Demo Credentials (after seed)
- Admin: `babul@example.com` / `password123`
- Member: `rajendra@example.com` / `password123`

## Core REST APIs
- `POST /api/auth/register-admin`
- `POST /api/auth/login`
- `GET/POST /api/members` (POST admin only)
- `DELETE /api/members/:id` (admin only)
- `GET/POST /api/expenses`
- `POST /api/settlements/generate` (admin only)
- `GET /api/settlements/:id/pdf`
- `POST /api/admin/reset` (admin only)
- `GET /api/notifications`

## Notes for Android Migration
- Keep API contracts stable.
- Replace React UI with React Native/Flutter while reusing backend.
- Socket.io event contract can stay same for real-time updates.

## UI Preview (Component layout snippet)
Main dashboard is a 3-column responsive grid (`md:grid-cols-3`) that collapses to single-column on mobile with card-based sections for:
- Expense form
- Chat-like expense feed
- Admin actions
- Settlement result
- Notifications

