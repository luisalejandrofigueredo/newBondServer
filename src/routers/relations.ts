import yargs, { describe, env, options } from 'yargs'
import express, { Request, Response } from 'express';
import { argv } from 'node:process';
import moment from '../../node_modules/moment/moment';
import { AppDataSource } from "../data-source"
import { logger } from "../utils/utils";
import { User } from '../entity/User';
import { Project } from "../entity/Project";
import { Relation } from "../entity/Relation";
import * as jwt from 'jsonwebtoken';
import fs from 'fs';
const privateKey = fs.readFileSync('config/private.key');
const relationsRouter = express.Router();


relationsRouter.use((req:Request, _res:Response, next) => {
    if (!global.argv.nm) {
      const date = moment(Date.now());
      console.log('/relations', req.url)
      console.log('Time: ', date.format("dddd, MMMM Do YYYY, h:mm:ss a"));
    }
    next();
  });

relationsRouter.use((req:Request, res:Response, next)=>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null)
    {
      logger.info(`Request without token in node possible hacker attack`);
      return res.sendStatus(401); 
    }
    jwt.verify(token, privateKey, (err: any, data: any) => {
      if (err){
       logger.info(`Authorization error`,err);
       return res.sendStatus(403);
      }
      next()
    })
  });


  relationsRouter.get('/getAll',async (req:Request,res:Response)=>{
    const id = parseInt(decodeURI(<string>req.query.id));
    try {
      const relationsRepository=AppDataSource.getRepository(Relation);
      const projects=await relationsRepository.find({
        relations:{from:true,to:true},
        select:{id:true,description:true} ,
        where:{project:{id:id}}});
      res.status(200).json(projects); 
    } catch (error) {
    }
  });

export {relationsRouter}