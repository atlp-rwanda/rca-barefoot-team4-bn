import express from "express";
import { auth } from "../middlewares/auth";
import {
  deleteHandler,
  loginHandler,
  logout,
  registerUserHandler,
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { loginUserSchema, registerUserSchema } from "../models/user.model";

const router = express.Router();

router.post("/register", validate(registerUserSchema), registerUserHandler);
router.post("/login", validate(loginUserSchema), loginHandler);
router.post("/logout",auth, logout)
router.delete("/", deleteHandler);

export default router;
