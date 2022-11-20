import yargs, { options } from 'yargs'
import { AppDataSource } from "./data-source"
import express, { Express, Request, Response } from 'express';
import { nodeRouter } from "./routers/node";
import { loginRouter } from "./routers/login";
import { projectRouter } from "./routers/projects";
import {testRouter} from './test/test';
import * as https from "https";
import { logger } from "./utils/utils";

import cors from 'cors'
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { relationsRouter } from './routers/relations';
import { eventsConRouter } from "./routers/eventsCon";




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
app.use('/project', projectRouter);
app.use('/relations',relationsRouter);
app.use('/eventsCon',eventsConRouter)
/**Comment this line for production */
app.use('/test', testRouter);
app.use(function(err, req, res, next) {

  // error handling logic
  logger.info(`Error from IP ${req.ip}`);
  logger.info(`Error ${err.stack}`);
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
/*https.createServer({key:'',cert:''},app)*/


app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

AppDataSource.initialize().then(async () => {
     console.log(`⚡️[server]:DataBase is connected`);
}).catch(error => console.log(error))
