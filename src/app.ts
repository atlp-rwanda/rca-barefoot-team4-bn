import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import routes from "./routes";

import validateEnv from "./utils/validateEnv";

validateEnv();

const app = express();

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
  servers: [{ url: "http://localhost:3000/api/v1" }],
};
const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts"], // Path to the API routes
};
const swaggerSpec = swaggerJSDoc(options);

app.use("/api/v1", routes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
