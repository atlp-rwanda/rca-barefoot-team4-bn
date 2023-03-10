<<<<<<< HEAD
import express, { type Request, type Response } from "express";
import bodyParser from "body-parser";
=======
import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import { Swaggiffy } from 'swaggiffy';
>>>>>>> c4b3bef39c78fd3180416ffce9b538545b8234ab

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = 3000;

<<<<<<< HEAD
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Barefoot Nomad APIs");
});
=======
new Swaggiffy().setupExpress(app).swaggiffy();

app.get('/',(req:Request, res:Response) => {
    res.send("Welcome to Barefoot Nomad APIs")
})
>>>>>>> c4b3bef39c78fd3180416ffce9b538545b8234ab

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
