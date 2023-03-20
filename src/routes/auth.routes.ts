import express from "express";
import {
  deleteHandler,
  registerUserHandler,
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { registerUserSchema } from "../models/user.model";

const router = express.Router();

router.post("/register", validate(registerUserSchema), registerUserHandler);
router.delete("/", deleteHandler);

export default router;
