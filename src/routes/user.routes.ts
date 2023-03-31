/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import { deserializeUser } from "../middlewares/deserializeUser";
import { requireUser } from "../middlewares/requireUser";
import { restrictTo } from "../middlewares/restrictTo";
import { makeAdminHandler } from "../controllers/user.controller";

const router = express.Router();

router.put(
  "/make-admin/:userId",
  deserializeUser,
  requireUser,
  restrictTo("SUPER_ADMIN", "TRAVEL_ADMINISTRATOR"),
  makeAdminHandler
);

export default router;
