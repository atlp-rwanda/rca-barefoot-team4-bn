/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import {
  deleteUsersHandler,
  loginHandler,
  registerUserHandler,
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { loginUserSchema, registerUserSchema } from "../models/user.model";
import { deserializeUser } from "../middlewares/deserializeUser";
import { requireUser } from "../middlewares/requireUser";
import { restrictTo } from "../middlewares/restrictTo";

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterUserInput:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *           enum: [USER, ADMIN]
 *         password:
 *           type: string
 *         passwordConfirm:
 *           type: string
 *       example:
 *         firstName: John
 *         lastName: Doe
 *         email: johndoe@example.com
 *         role: USER
 *         password: mysecretpassword
 *         passwordConfirm: mysecretpassword
 *     LoginUserInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *       example:
 *         email: johndoe@example.com
 *         password: mysecretpassword
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/RegisterUserInput"
 *     responses:
 *       200:
 *         description: User registration successful
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginUserInput"
 *     responses:
 *       200:
 *         description: User login successful
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /:
 *   delete:
 *     summary: Remove all the users
 *     responses:
 *       200:
 *         description: All users removed successfully. Start over
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

const router = express.Router();

router.post("/register", validate(registerUserSchema), registerUserHandler);
router.post("/login", validate(loginUserSchema), loginHandler);
router.delete(
  "/",
  deserializeUser,
  requireUser,
  restrictTo("SUPER_ADMIN", "TRAVEL_ADMINISTRATOR"),
  deleteUsersHandler
);

export default router;
