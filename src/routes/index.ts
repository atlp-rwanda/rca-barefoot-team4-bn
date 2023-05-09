import express from "express";
import userRoute from "./user.routes";
import authRoute from "./auth.routes";
import welcomeRoute from "./welcome.route";

const router = express.Router();

/*
Author: Merlyne Iradukunda
Date: April 5, 2023
*/

router.use("/", welcomeRoute);
router.use("/users", userRoute);
router.use("/auth", authRoute);

export default router;
