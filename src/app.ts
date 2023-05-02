import "dotenv/config";
import express, { type Request, type Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import i18next from "./middlewares/i18next";
import middleware from "i18next-http-middleware";

import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import accomodationRouter from "./routes/accomodation.routes";
import airportRouter from "./routes/flight/airport.routes";
import flightRouter from "./routes/flight/flight.routes";
import validateEnv from "./utils/validateEnv";

// import

validateEnv();

const app = express();
// const prisma = new PrismaClient();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(middleware.handle(i18next));
app.use(cors())

const PORT = 3000;

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.0",
    description: "Documentation for the API endpoints",
  },
  servers: [
    { url: "http://localhost:3000/api/v1/auth" },
    { url: "http://localhost:3000/api/v1/accomodation" },
  ],
};
const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts"], // Path to the API routes
};
const swaggerSpec = swaggerJSDoc(options);

app.get("/", (req: Request, res: Response) => {
  res.send(req.t("welcome")).status(200);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/accomodation", accomodationRouter);
app.use("/api/v1/airport", airportRouter);
app.use("/api/v1/flight", flightRouter);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
