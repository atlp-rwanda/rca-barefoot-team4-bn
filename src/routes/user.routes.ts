/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import { deserializeUser } from "../middlewares/deserializeUser";
import { requireUser } from "../middlewares/requireUser";
import { restrictTo } from "../middlewares/restrictTo";
import { changeRoleHandler } from "../controllers/user.controller";

const router = express.Router();

router.put(
  "/change-role/:userId",
  deserializeUser,
  requireUser,
  restrictTo("SUPER_ADMIN", "TRAVEL_ADMINISTRATOR"),
  changeRoleHandler
);

export default router;
