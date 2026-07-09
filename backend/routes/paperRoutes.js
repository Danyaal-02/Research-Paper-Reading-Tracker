import { Router } from "express";
import {
  createPaper,
  getPapers,
  getAnalytics,
} from "../controllers/paperController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

// All paper routes are protected
router.use(authMiddleware);

router.post("/", createPaper);
router.get("/", getPapers);
router.get("/analytics", getAnalytics);

export default router;
