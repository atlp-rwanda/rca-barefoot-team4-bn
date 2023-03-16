import express, { type Request, type Response } from "express";
import bodyParser from "body-parser";
import swaggerUi, { type SwaggerUiOptions } from "swagger-ui-express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

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
  prisma.user
    .findMany()
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send(err));
});

app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(swaggerDefinition, options));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  prisma.$queryRaw`SELECT * FROM User`
    .then((n) => {
      console.log("\nCONNECTED TO DATABASE\n");
    })
    .catch((err) => {
      console.log("FAILED TO CONNECT TO DB", err);
    });
});

export default app;
