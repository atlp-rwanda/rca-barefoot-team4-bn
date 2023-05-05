import express from "express";
import {
  // assignRoomsHandler,
  createAccomodationHandler,
} from "../controllers/accomodation.controller";
import { deserializeUser } from "../middlewares/deserializeUser";
import { requireUser } from "../middlewares/requireUser";
import { restrictTo } from "../middlewares/restrictTo";
import upload from "../utils/multerUpload";
const router = express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     accomodationInput:
 *       type: object
 *       required:
 *         - destinationName
 *         - address
 *         - contact
 *         - description
 *         - centerImage
 *         - rooms
 *       properties:
 *         destinationName:
 *           type: string
 *         address:
 *           type: string
 *         contact:
 *           type: string
 *         description:
 *           type: string
 *         centerImage:
 *           type: string
 *         rooms:
 *           type: array
 *       example:
 *         destinationName: Radison hotel
 *         address: KN 42 St.
 *         contact: ++250780474209
 *         description: The best hotel in the city
 *         centerImage: radison.png
 *         websiteUrl: https://radisonblue.com
 *         rooms: [
 *                 {
 *                  roomName: PRESIDENTIAL,
 *                  roomAmount: 500000,
 *                  numberOfRooms: 10,
 *                 },
 *                 {
 *                  roomName: DELUXE,
 *                  roomAmount: 700000,
 *                  numberOfRooms: 20,
 *                 },
 *                ]
 */

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new accomodation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/accomodationInput"
 *     responses:
 *       200:
 *         description: Successfully created a new accomodation.
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/* eslint-disable @typescript-eslint/no-misused-promises */
router.use(deserializeUser);
router.use(requireUser);
router.use(restrictTo("SUPER_ADMIN", "TRAVEL_ADMIN"));

router.route("/").post(upload.single("centerImage"), createAccomodationHandler);

export default router;
