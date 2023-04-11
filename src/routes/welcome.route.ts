import express, { type Request, type Response } from "express";
const router = express.Router();


router.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Barefoot Nomad APIs");
});

export default router;
