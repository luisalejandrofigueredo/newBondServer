import yargs, { describe, env, options } from 'yargs'
import express, { Request, Response } from 'express';
import { argv } from 'node:process';
import moment from '../../node_modules/moment/moment';
import { AppDataSource } from "../data-source"
import { logger } from "../utils/utils";
import * as jwt from 'jsonwebtoken';
import fs from 'fs';
import { eventCon } from "../entity/eventsCon";
import { Relation } from '../entity/Relation';
const privateKey = fs.readFileSync('config/private.key');
const eventsConRouter = express.Router();

eventsConRouter.use((req: Request, _res: Response, next) => {
  if (!global.argv.nm) {
    const date = moment(Date.now());
    console.log('/eventsCon', req.url)
    console.log('Time: ', date.format("dddd, MMMM Do YYYY, h:mm:ss a"));
  }
  next();
})


eventsConRouter.use((req: Request, res: Response, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) {
    logger.info(`Request without token in node possible hacker attack`);
    return res.sendStatus(401);
  }
  jwt.verify(token, privateKey, (err: any, data: any) => {
    if (err) {
      logger.info(`Authorization error`, err);
      return res.sendStatus(403);
    }
    next()
  })
});


eventsConRouter.get('/getAll', async (req: Request, res: Response) => {
  const id = parseInt(decodeURI(<string>req.query.id));
  try {
    const relationsRepository = AppDataSource.getRepository(Relation);
    const relations = await relationsRepository.findOne({
      relations: { eventCones: true },
      where: { id:id  }
    });
    res.status(200).json(relations);
  } catch (error) {
  }
});

eventsConRouter.post('/add', async (req: Request, res: Response) => {
  const id:number=req.body.id
  if (req.body.data === undefined) {
    res.status(400).json({ message: 'Bad formed post' });
    return;
  }
  const { name, description } = req.body.data as eventCon
  try {
    if (name === undefined || description === undefined) {
      res.status(400).json({ message: 'Bad formed post' });
      return;
    }
    const relationRepository= AppDataSource.getRepository(Relation);
    await relationRepository.findOne({where:{id:id}}).then((relation)=>{
      const eventConRepository = AppDataSource.getRepository(eventCon);
      let eventConnection = new eventCon();
      eventConnection.name=name;
      eventConnection.description=description;
      eventConnection.relation=relation
      eventConRepository.save(eventConnection).then((saved)=>{
        res.status(200).json(saved);
      });
    })
  } catch (error) {
    
  }
});

export {eventsConRouter}