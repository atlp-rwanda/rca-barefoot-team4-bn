/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import { deserializeUser } from "../middlewares/deserializeUser";
import { requireUser } from "../middlewares/requireUser";
import { restrictTo } from "../middlewares/restrictTo";
import { changeRoleHandler } from "../controllers/user.controller";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ChangeRoleInput:
 *       type: object
 *       required:
 *         - newRole
 *       properties:
 *         newRole:
 *           type: string
 *       example:
 *         newRole: TRAVEL_ADMIN
 */

/**
 * @swagger
 * /change-role/:userId:
 *   put:
 *     summary: Change user's role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ChangeRoleInput"
 *     responses:
 *       200:
 *         description: User's role changed
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.put(
  "/change-role/:userId",
  deserializeUser,
  requireUser,
  restrictTo("SUPER_ADMIN", "TRAVEL_ADMIN"),
  changeRoleHandler
);

export default router;
