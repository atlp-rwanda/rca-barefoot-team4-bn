import express from "express";
import {
  // assignRoomsHandler,
  createAccomodationHandler,
} from "../controllers/accomodation.controller";
import { deserializeUser } from "../middlewares/deserializeUser";
import { requireUser } from "../middlewares/requireUser";
import { restrictTo } from "../middlewares/restrictTo";

const router = express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     accomodationInput:
 *       type: object
 *       required:
 *         - accomodationFacility
 *         - centerImage
 *         - numberOfRooms
 *         - rooms
 *       properties:
 *         accomodationFacility:
 *           type: string
 *         centerImage:
 *           type: string
 *         numberOfRooms:
 *           type: number
 *         rooms:
 *           type: array
 *       example:
 *         accomodationFacility: "Radisson blue hotel"
 *         centerImage: radisson.png
 *         numberOfRooms: 2
 *         rooms: [
 *                 {
 *                  roomName: room 1,
 *                  roomType: DELUXE,
 *                 },
 *                 {
 *                  roomName: room 2,
 *                  roomType: DELUXE,
 *                 }
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

router.route("/").post(createAccomodationHandler);
export default router;
