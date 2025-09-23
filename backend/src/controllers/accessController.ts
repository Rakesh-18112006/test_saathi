import { Request, Response } from "express";
import AccessRequest from "../models/AccessRequest";
import Migrant from "../models/Migrant";
import { generateOtp, sendOtpSms } from "../utils/otp";
import HealthRecord from "../models/HealthRecord";
import { summarizeMedicalRecords } from "../utils/ai"; 

// ✅ Request OTP for accessing migrant records
export async function requestAccess(req: Request, res: Response) {
  try {
    const { migrantId } = req.body;
    const requesterId = (req as any).user?.id;
    if (!migrantId || !requesterId)
      return res.status(400).json({ message: "missing" });

    const migrant = await Migrant.findOne({ uniqueId: migrantId });
    if (!migrant) return res.status(404).json({ message: "migrant not found" });

    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min
    const ar = new AccessRequest({
      migrantId,
      requesterId,
      otp,
      otpExpiresAt,
      status: "pending",
    });
    await ar.save();

    await sendOtpSms(migrant.phone, otp);

    return res.json({
      requestId: ar._id,
      message: "OTP sent to migrant phone",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "server error" });
  }
}

// ✅ Verify OTP
export async function verifyOtp(req: Request, res: Response) {
  try {
    const { requestId, otp } = req.body;
    const ar = await AccessRequest.findById(requestId);

    if (!ar)
      return res.status(404).json({ message: "access request not found" });
    if (ar.status !== "pending")
      return res.status(400).json({ message: "invalid request state" });

    if (ar.otpExpiresAt && ar.otpExpiresAt < new Date()) {
      ar.status = "expired";
      await ar.save();
      return res.status(400).json({ message: "OTP expired" });
    }

    if (ar.otp !== otp)
      return res.status(400).json({ message: "OTP mismatch" });

    ar.status = "granted";
    ar.verifiedAt = new Date();
    await ar.save();

    return res.json({ message: "access granted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "server error" });
  }
}

// ✅ Fetch migrant health records (if access granted)
export async function getRecordsIfAccessGranted(req: Request, res: Response) {
  try {
    const migrantId = req.params.migrantId;
    const requesterId = (req as any).user?.id;

    // find latest granted access request
    const ar = await AccessRequest.findOne({
      migrantId,
      requesterId,
      status: "granted",
    }).sort({ verifiedAt: -1 });

    if (!ar) return res.status(403).json({ message: "access not granted" });

    const records = await HealthRecord.find({ migrantId }).sort({
      createdAt: -1,
    });

    return res.json({ records });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "server error" });
  }
}

// ✅ Create a new health record (only if access granted)
// Get migrant profile details (only if access granted)
export async function getMigrantProfileIfGranted(req: Request, res: Response) {
  try {
    const migrantId = req.params.migrantId;
    const requesterId = (req as any).user?.id;

    // check if doctor has access
    const ar = await AccessRequest.findOne({
      migrantId,
      requesterId,
      status: "granted",
    }).sort({ verifiedAt: -1 });

    if (!ar) return res.status(403).json({ message: "access not granted" });

    // fetch migrant details
    const migrant = await Migrant.findOne({ uniqueId: migrantId }).select(
      "name phone dob gender language"
    );

    if (!migrant) return res.status(404).json({ message: "migrant not found" });

    return res.json({ migrant });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "server error" });
  }
}

export async function createRecordIfGranted(req: Request, res: Response) {
  try {
    const { migrantId, title, content } = req.body;
    const requesterId = (req as any).user?.id;

    if (!migrantId || !title || !content) {
      return res.status(400).json({ message: "missing fields" });
    }

    // check if doctor has access
    const ar = await AccessRequest.findOne({
      migrantId,
      requesterId,
      status: "granted",
    }).sort({ verifiedAt: -1 });

    if (!ar) return res.status(403).json({ message: "access not granted" });

    // create record
    const record = new HealthRecord({
      migrantId,
      title,
      content,
      createdBy: requesterId,
      createdAt: new Date(),
    });
    await record.save();

    return res.json({
      message: "record created successfully",
      record,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "server error" });
  }
}

// Generate AI summary for a migrant's records using Gemini (access-checked)
export async function aiSummary(req: Request, res: Response) {
  try {
    const migrantId = req.params.migrantId;
    const requesterId = (req as any).user?.id;

    // check if doctor has access
    const ar = await AccessRequest.findOne({
      migrantId,
      requesterId,
      status: "granted",
    }).sort({ verifiedAt: -1 });

    if (!ar) return res.status(403).json({ message: "access not granted" });

    // fetch last 10 records
    const records = await HealthRecord.find({ migrantId })
      .sort({ createdAt: -1 })
      .limit(10);

    const combinedText = records
      .map((r) => `${r.title}: ${r.content}`)
      .join("\n\n");

    const summary = await summarizeMedicalRecords(combinedText || "No records");

    return res.json({ summary });
  } catch (err) {
    console.error("AI summary error:", err);
    return res.status(500).json({ message: "server error" });
  }
}
