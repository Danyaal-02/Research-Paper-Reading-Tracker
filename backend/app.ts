import express, { Express, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

// Routes
import authRoutes from "./routes/authRoutes.js";
import paperRoutes from "./routes/paperRoutes.js";

// Middleware
import { errorHandler } from "./middleware/errorHandler.js";
import { AppError } from "./utils/AppError.js";
import morganMiddleware from "./middleware/morganMiddleware.js";

const app: Express = express();

// Security Middleware
app.use(helmet());
app.use(morganMiddleware);


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 login attempts per window
  message: { success: false, message: 'Too many login attempts. Try again later.' },
});

// Global Middleware
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || "http://localhost:5173").split(",");

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new AppError("Not allowed by CORS", 403));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use((req, res, next) => {
  mongoSanitize.sanitize(req.body);
  mongoSanitize.sanitize(req.query);
  mongoSanitize.sanitize(req.params);
  next();
});
app.use(cookieParser());

// Base Route
app.get("/", (req: Request, res: Response) => {
  res.json({ success: true, message: "Research Paper Tracker API is running 🚀" });
});

// API Routes
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/signup", authLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/papers", paperRoutes);

// Global Error Handler
app.use(errorHandler as express.ErrorRequestHandler);

export default app;
