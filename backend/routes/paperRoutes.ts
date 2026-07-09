import express from "express";
import {
  addPaper,
  getPapers,
  getPaperAnalytics,
} from "../controllers/paperController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // All paper routes require auth

router.route("/").post(addPaper).get(getPapers);
router.route("/analytics").get(getPaperAnalytics);

export default router;
