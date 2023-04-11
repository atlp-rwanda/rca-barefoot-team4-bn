/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";

import {
  getAllUsers,
  getUserId,
  updateUserProfile,
} from "../controllers/user.controller";

const router = express.Router();

/*
Author: Merlyne Iradukunda
Date: April 5, 2023
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUserInput:
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
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - Lesson
 *     description: Returns an array of UserCategories
 *     parameters:
 *       - name: page
 *         description: page number
 *         in: query
 *         type: string
 *       - name: limit
 *         description: elements per page
 *         in: query
 *         type: string
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", getUserId);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     description: Get user by id
 *     parameters:
 *       - name: page
 *         description: page number
 *         in: query
 *         type: string
 *       - name: limit
 *         description: elements per page
 *         in: query
 *         type: string
 *       - name: id
 *         description: user id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", getUserId);

/**
 * @swagger
 * /users/:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns an array of users
 *     parameters:
 *       - name: page
 *         description: page number
 *         in: query
 *         type: string
 *       - name: limit
 *         description: elements per page
 *         in: query
 *         type: string
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal Server Error
 */
router.get("/", getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     description: Updates a Student
 *     requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                schema:
 *                    $ref: '#/components/schemas/UpdateUserInput'
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         description: User id
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad Request | Validation Error
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.put("/:id", updateUserProfile);

export default router;
