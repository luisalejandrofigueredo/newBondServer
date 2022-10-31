import yargs, { options } from 'yargs'
import { AppDataSource } from "./data-source"
import { Node } from "./entity/Node"
import express, { Express, Request, Response } from 'express';
import { nodeRouter } from "./routers/node";
import { loginRouter } from "./routers/login";
import {testRouter} from './routers/test'
import cors from 'cors'
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';




dotenv.config();

global.argv= yargs(process.argv.slice(2)).option({
  nm: {
    type: 'boolean',
    alias: 'nm',
    description: 'Not use middleware'
  }
}).help().alias('help', 'h').parseSync()

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use('/node', nodeRouter);
app.use('/login', loginRouter);
app.use('/test', testRouter);


app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

AppDataSource.initialize().then(async () => {
     console.log(`⚡️[server]:DataBase is connected`);
}).catch(error => console.log(error))
