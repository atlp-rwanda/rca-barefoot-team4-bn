import "dotenv/config";
import express, { type Request, type Response } from "express";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import validateEnv from "./utils/validateEnv";

validateEnv();

const app = express();
// const prisma = new PrismaClient();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = 3000;

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.0",
    description: "Documentation for the API endpoints",
  },
  servers: [{ url: "http://localhost:3000/api/v1/auth" }],
};
const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts"], // Path to the API routes
};
const swaggerSpec = swaggerJSDoc(options);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Barefoot Nomad APIs");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
