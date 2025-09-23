import { Router } from "express";
import {
  createHealthRecord,
  getHealthRecords,
} from "../controllers/healthController";
import { authMiddleware } from "../middlewares/auth";
const router = Router();

router.post("/", authMiddleware, createHealthRecord);
router.get("/:migrantId", authMiddleware, getHealthRecords);


export default router;
