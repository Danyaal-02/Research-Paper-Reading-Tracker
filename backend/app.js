import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import paperRoutes from "./routes/paperRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.NODE_ENV === "production"
      ? process.env.CLIENT_URL
      : "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Research Paper Tracker API is running 🚀",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/papers", paperRoutes);

// Global error handler (must be last)
app.use(errorHandler);

export default app;