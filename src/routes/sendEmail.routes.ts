import express from "express";
import { sendEmailController } from "../controllers/sendEmail.controller";
const router = express.Router();

router.post("/", sendEmailController);

export default router;
