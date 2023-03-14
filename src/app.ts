import express, { type Request, type Response } from "express";
import bodyParser from "body-parser";
import swaggerUi, { type SwaggerUiOptions } from "swagger-ui-express";
const app = express();

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
  res.send("Welcome to Barefoot Nomad APIs");
});

app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(swaggerDefinition, options));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
