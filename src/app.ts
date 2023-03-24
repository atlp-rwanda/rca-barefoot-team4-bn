import "dotenv/config";
import express, { type Request, type Response } from "express";
import bodyParser from "body-parser";
import swaggerUi, { type SwaggerUiOptions } from "swagger-ui-express";
// import { PrismaClient } from "@prisma/client";

import authRouter from "./routes/auth.routes";
import validateEnv from "./utils/validateEnv";
import  sendEmailRoute  from "./routes/sendEmail.routes";

validateEnv();

const app = express();
// const prisma = new PrismaClient();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = 3000;

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "RCA BAREFOOT TEam4 Bin Backend APIS",
    version: "1.0.0",
    description: "Documented Swagger Apis For RCA-BAREFOOT-TEAM4-BIN Project",
  },
  servers: [
    {
      url: "http://localhost:3000",
    },
  ],
};
const options: SwaggerUiOptions = {
  swaggerOptions: {
    apis: [
      {
        url: "./routes/*.routes.ts",
      },
    ],
  },
};

app.get("/", (req: Request, res: Response) => {
  // prisma.user
  //   .findMany()
  //   .then((users) => res.send(users))
  //   .catch((err) => res.status(500).send(err));

  res.send("Welcome to Barefoot Nomad APIs");
});

app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(swaggerDefinition, options));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/sendEmail", sendEmailRoute);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
