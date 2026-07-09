# Research Paper Reading Tracker

A full-stack MERN (MongoDB, Express, React, Node.js) web application for academics and researchers to track, analyze, and manage their research paper reading progress with interactive analytics and visualizations.

## Features

### 📚 Paper Library
- Add research papers with title, author, domain, reading stage, citation count, impact score, and date
- View all papers in a sortable, responsive data grid
- Multi-select filters for Reading Stage, Research Domain, and Impact Score
- Date range filtering (This Week, This Month, Last 3 Months, All Time)

### 📊 Reading Analytics
- **Summary Cards**: Total papers, completion rate, average citations, reading stage distribution
- **Funnel Chart**: Paper count at each reading stage to identify workflow bottlenecks
- **Scatter Plot**: Citation count grouped by Impact Score with color-coded markers
- **Stacked Bar Chart**: Papers by domain with reading stage breakdown

### 🔐 Authentication
- JWT-based authentication with HTTP-only cookies
- Secure signup and login with bcrypt password hashing
- User data isolation — each user only sees their own papers

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, Tailwind CSS v4 |
| State Management | TanStack Query (React Query) |
| Data Table | TanStack Table |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + HTTP-only Cookies |
| Icons | Lucide React |

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Danyaal-02/Research-Paper-Reading-Tracker.git
   cd Research-Paper-Reading-Tracker
   ```

2. **Backend Setup**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   npm install
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/research-paper-tracker
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

## Project Structure

```
research-paper-tracker/
├── backend/
│   ├── config/db.js                    # MongoDB connection
│   ├── constants/paperEnums.js         # Centralized enum values
│   ├── controllers/
│   │   ├── authController.js           # Auth endpoints
│   │   └── paperController.js          # Paper CRUD + analytics
│   ├── middleware/
│   │   ├── authMiddleware.js           # JWT verification
│   │   ├── errorHandler.js             # Global error handler
│   │   └── validateRequest.js          # Request validation
│   ├── models/
│   │   ├── User.js                     # User schema
│   │   └── Paper.js                    # Paper schema
│   ├── routes/
│   │   ├── authRoutes.js               # Auth routes
│   │   └── paperRoutes.js              # Paper routes
│   ├── services/analyticsService.js    # MongoDB aggregation pipelines
│   ├── utils/jwtHelpers.js             # JWT token utilities
│   └── server.js                       # App entry point
└── frontend/
    └── src/
        ├── components/
        │   ├── ui/                     # Reusable UI primitives
        │   └── common/                 # Layout & navigation
        ├── features/
        │   ├── auth/                   # Authentication module
        │   ├── papers/                 # Paper management module
        │   └── analytics/              # Analytics & charts module
        ├── lib/                        # Axios & React Query config
        ├── App.jsx                     # Root app component
        └── main.jsx                    # Entry point
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/papers` | Add new paper | Yes |
| GET | `/api/papers` | Get papers (with filters) | Yes |
| GET | `/api/papers/analytics` | Get analytics data | Yes |
