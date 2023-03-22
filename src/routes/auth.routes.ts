import express from "express";
import {
  deleteUsersHandler,
  loginHandler,
  registerUserHandler,
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { loginUserSchema, registerUserSchema } from "../models/user.model";

const router = express.Router();

router.post("/register", validate(registerUserSchema), registerUserHandler);
router.post("/login", validate(loginUserSchema), loginHandler);
router.delete("/", deleteUsersHandler);

export default router;
