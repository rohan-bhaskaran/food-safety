import { Router } from "express";
import multer from "multer";
import { scanLabel } from "../controllers/scanController.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const router = Router();

router.post("/scan", upload.single("image"), scanLabel);

export default router;
