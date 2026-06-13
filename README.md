![Banner](./screenshots/home.png)

# Full-Stack AI CareerOS Dashboard SaaS

Welcome to **CareerOS**, a world-class, production-ready Full Stack AI Career Optimization and Job Tracking SaaS dashboard designed to look like a premium product built by a funded startup

## Live Demo
https://ai-careeros-theta.vercel.app

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Socket.io


This repository contains two primary modules:
1. `frontend/` - Next.js 15 App Router + React 19 + TypeScript + Tailwind CSS + Recharts + Framer Motion.
2. `backend/` - Node.js + Express.js + Mongoose (MongoDB) + Socket.io + JWT Auth (with Refresh tokens).

---

## 🚀 Key Features

1. **Dual-Mode Backend DB Fallback**: Connects to MongoDB Atlas when `MONGODB_URI` is provided, but automatically falls back to an **in-memory database simulation** with startup seed data if no database environment variables are configured. Run it immediately out-of-the-box!
2. **Double-Simulator Client API**: The frontend calls the API endpoints, but if the Express server is offline, it automatically shifts to **client-side memory simulation**, allowing static deploys (e.g. on Vercel) to remain fully functional for reviewers.
3. **Adaptive Breakpoint Layouts**: Native bottom-navigation bar and mobile card sheets on screens `<768px`, hybrid grids on tablets, and double-column analytics sidebar dashboard layouts on desktops `1024px+`.
4. **ATS Resume Scorer**: AI resume evaluator providing formatting checks, target keyword matches, missing skill list extractions, and section-by-section suggestions.
5. **Kanban Application Board**: Drag-and-drop board on desktop, and touch-interactive stage update shortcuts on mobile to manage job statuses (Applied, Interviewing, Offered, Rejected).
6. **AI Mock Interviews**: Category-specific questions (Behavioral, Technical, System Design) with user response entry and instant score grading feedback.
7. **Real-time Notifications**: Real-time server-to-client push updates (scheduled interview alerts, ATS analysis completions) using WebSockets (Socket.io).

---

## 🔐 Quick Demo Credentials

For immediate evaluation, both User and Admin account settings have pre-seeded profiles:

*   **Standard Candidate Account**
    *   **Email**: `user@career.os`
    *   **Password**: `password123`
*   **Platform Administrator Account**
    *   **Email**: `admin@career.os`
    *   **Password**: `password123`

---

![Dashboard](./screenshots/dashboard.png)
![resume analyzer](./screenshots/resumeanalyzer.png)
## 🛠️ Local Installation & Launch

Ensure you have [Node.js v24+](https://nodejs.org) and [NPM v11+](https://npmjs.com) installed.

### 1. Launch the Backend API
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Open a `.env` file (Optional - if omitted, server operates in simulator mode):
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_custom_jwt_secret
   JWT_REFRESH_SECRET=your_custom_refresh_secret
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *The server will boot on `http://localhost:5000`.*

### 2. Launch the Frontend Next.js Client
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Configure `.env.local` (Optional - defaults to local API):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
3. Start the dev build server:
   ```bash
   npm run dev
   ```
   *Open `http://localhost:3000` in your web browser to check.*

---

## 📁 Project Architecture & Breakdowns

```
workspace/
├── README.md
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js App Router Pages
│   │   ├── components/          # Reusable UI Blocks (Providers, Navs)
│   │   ├── context/             # Theme, Auth, Socket Providers
│   │   └── services/            # Dual-Mode Client API Client
│   ├── package.json
│   └── tsconfig.json
└── backend/
    ├── src/
    │   ├── config/              # DB & In-Memory Store seeds
    │   ├── controllers/         # Express Request managers
    │   ├── middleware/          # Guard checkers
    │   ├── models/              # MongoDB Schemas
    │   └── routes/              # Routing endpoints
    ├── index.ts                 # Express Entry
    └── package.json
```
👨‍💻 Author:

Suraj Soni
GitHub: https://github.com/suraj-5021
LinkedIn: https://www.linkedin.com/in/suraj-soni-1773a5320


