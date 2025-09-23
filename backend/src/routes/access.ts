import { Router } from "express";
import {
  requestAccess,
  verifyOtp,
  getRecordsIfAccessGranted,
  createRecordIfGranted,
  getMigrantProfileIfGranted,
  aiSummary
} from "../controllers/accessController";
import { authMiddleware } from "../middlewares/auth";
const router = Router();

router.post("/request", authMiddleware, requestAccess);
router.post("/verify", authMiddleware, verifyOtp);
router.get("/records/:migrantId", authMiddleware, getRecordsIfAccessGranted);
router.get("/profile/:migrantId", authMiddleware, getMigrantProfileIfGranted);
router.post(
  "/health-records/:migrantId",
  authMiddleware,
  createRecordIfGranted
);
router.get("/aisummary/:migrantId", authMiddleware, aiSummary);

export default router;
