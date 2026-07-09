import express, { Express, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes
import authRoutes from "./routes/authRoutes.js";
import paperRoutes from "./routes/paperRoutes.js";

// Middleware
import { errorHandler } from "./middleware/errorHandler.js";

const app: Express = express();

// Global Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Base Route
app.get("/", (req: Request, res: Response) => {
  res.json({ success: true, message: "Research Paper Tracker API is running 🚀" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/papers", paperRoutes);

// Global Error Handler
app.use(errorHandler as any);

export default app;
