import express, { Express, Request, Response, NextFunction } from "express";
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

// Global Middleware
const ALLOWED_ORIGINS = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(",").map(origin => origin.trim())
  : ["http://localhost:5173", "http://127.0.0.1:5173"];

// 1. ABSOLUTE TOP-LEVEL CORS REGISTERING
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Security Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morganMiddleware);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 login attempts per window
  message: { success: false, message: 'Too many login attempts. Try again later.' },
});
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

// 2. ROUTE CATCH-ALL AND 404 SANITIZATION
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found on this server.`
  });
});

// Global Error Handler
app.use(errorHandler as express.ErrorRequestHandler);

export default app;
