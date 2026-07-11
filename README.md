# Research Paper Reading Tracker

An enterprise-grade Full-Stack Research Paper Reading Tracker designed to streamline research ingestion, track pipeline stages, and visualize reading habits through dynamic analytics data layers.

## 🚀 Deployed Endpoints

**Production Infrastructure Access Points:**
- **Frontend Deployment (Static UI):** [https://research-reading-tracker.onrender.com](https://research-reading-tracker.onrender.com)
- **Backend API Endpoint:** [https://research-paper-tracker-c6f6.onrender.com](https://research-paper-tracker-c6f6.onrender.com)

---

## 🛠 Architectural Tech Stack Matrix

The software stack is explicitly broken down across two distinct domains:

### Frontend Stack (Client)
- **Core Framework & Routing:** React 19+, React Router v7 (`react-router-dom`), and Vite.
- **Styling Engine:** Tailwind CSS v4 (via `@tailwindcss/vite`), with `clsx` and `tailwind-merge` for dynamic utility class resolution.
- **State & Data Fetching:** TanStack Query (`@tanstack/react-query`) for robust server state caching and async orchestration.
- **Data Architecture:** TanStack Table (`@tanstack/react-table`) for headless, highly optimized data grids.
- **Forms & Validation:** React Hook Form (`react-hook-form`) coupled with Zod (`@hookform/resolvers`, `zod`) for strict type-safe schema validation.
- **Analytics Visualization:** Highcharts (`highcharts`, `highcharts-react-official`) for complex 3D and 2D data analytics rendering.
- **Network & Utilities:** Axios for HTTP transport, `lucide-react` for scalable SVG iconography, and `react-hot-toast` for global toast notifications.

### Backend Stack (Server)
- **Core Framework:** Node.js, Express (`express`), and `express-async-handler` for clean promise resolution.
- **Database Architecture:** MongoDB Atlas (Cloud) driven by Mongoose ODM (`mongoose`).
- **Security & Validation:** Helmet (`helmet`) for HTTP headers, `express-mongo-sanitize` for NoSQL injection prevention, `express-rate-limit` for DDoS protection, and Zod (`zod`) for payload schema validation.
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) paired with `cookie-parser` and `bcryptjs` for secure password hashing and stateless HTTP-only cookie sessions.
- **Network & Logging:** CORS (`cors`) for cross-origin management, and an enterprise logging pipeline using Winston (`winston`) combined with Morgan (`morgan`).
- **Language & Execution:** TypeScript (`tsc`) with `tsx watch` for rapid active local development execution.

---

## 📂 Repository Tree & Code Architecture

Our repository follows a layer-pure, domain-driven structure.

```text
Research-Paper-Reading-Tracker/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/          # Atomic, dynamic shared primitive loaders (Skeleton.tsx, TableSkeleton.tsx)
│   │   ├── features/        # Modular frontend features containing isolated components and query hooks
│   │   └── ...
├── backend/
│   ├── src/
│   │   ├── controllers/     # Lightweight transport layers handling HTTP parsing and JSON formatting
│   │   ├── services/        # Isolated domain layers for MongoDB transactions and metric aggregations
│   │   └── ...
```

> [!NOTE]
> **Architectural Separations:**
> - **Frontend Features (`frontend/src/features/`):** Keeps business presentation rules tightly coupled to domain boundaries while isolated from global state pollution.
> - **Backend Services (`backend/src/services/`):** Ensures controllers remain extremely thin. All business computational reductions and database queries happen here.

---

## 💻 Step-by-Step Local Development Runtime Setup

Follow this explicit procedure to clone, initialize, and run the full stack locally:

### 1. Cloning & Installation
Clone the repository and install dependencies sequentially in both directories:

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Environment Configuration
Create `.env` files in both directories by duplicating the provided `.env.example` files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

**`backend/.env` Requirements:**
```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/database
PORT=5000
JWT_SECRET=your_jwt_secret_key
# IMPORTANT: No trailing slashes on allowed origins!
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,https://research-reading-tracker.onrender.com
```

**`frontend/.env` Requirements:**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Execution
Launch both runners concurrently to boot the full stack:

```bash
# Terminal 1: Backend Engine
cd backend
npm run dev

# Terminal 2: Frontend Vite Runner
cd frontend
npm run dev
```

---

## 🧪 Database Seeding Routines

To evaluate Highcharts components and infinite scrolling tables out of the box, you can automate database hydration using the included seed scripts.

Run the following script to inject a realistic mockup dataset (mock papers, custom pipeline tracking stages, user indices) directly into your local or remote MongoDB cluster:

```bash
cd backend
npm run db:seed
```

---

## ☁️ Operations & Cloud Hosting Architecture Notes

> [!WARNING]
> **Frontend Rewrite Rule Requirement (Render)**
> Single Page Applications strictly require route rewriting to prevent server-side `404` crashes during deep linking or page refreshes. In your Render Dashboard (or equivalent static host), configure the following rewrite rule:
> - **Source:** `/*`
> - **Action:** `Rewrite`
> - **Destination:** `/index.html`

> [!IMPORTANT]
> **CORS Management Guidelines**
> When provisioning new hosting environments, it is critical that the live staging or production client URLs are injected directly into the backend `CORS_ORIGINS` environment variable.
> Ensure that origins are provided as a comma-separated list **strictly without trailing slashes** (e.g., `https://domain.com` not `https://domain.com/`) to prevent origin mapping failures at the middleware level.
