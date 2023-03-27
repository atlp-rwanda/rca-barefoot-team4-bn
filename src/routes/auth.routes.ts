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
 *         password:
 *           type: string
 *         role:
 *           type: string
 *           enum: [USER, ADMIN]
 *       example:
 *         firstName: John
 *         lastName: Doe
 *         email: johndoe@example.com
 *         password: mysecretpassword
 *         role: USER
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
 *     summary: Delete a user
 *     responses:
 *       200:
 *         description: User deletion successful
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

const router = express.Router();

router.post("/register", validate(registerUserSchema), registerUserHandler);
router.post("/login", validate(loginUserSchema), loginHandler);
router.post("/logout",auth, logout)
router.delete("/", deleteHandler);

export default router;
