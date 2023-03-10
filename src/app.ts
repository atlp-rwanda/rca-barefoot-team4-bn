import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import { Swaggiffy } from 'swaggiffy';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = 3000;

new Swaggiffy().setupExpress(app).swaggiffy();

app.get('/',(req:Request, res:Response) => {
    res.send("Welcome to Barefoot Nomad APIs")
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;