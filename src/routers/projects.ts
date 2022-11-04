import yargs, { describe, env, options } from 'yargs'
import express, { Request, Response } from 'express';
import { argv } from 'node:process';
import moment from '../../node_modules/moment/moment';
import { AppDataSource } from "../data-source"
import { logger } from "../utils/utils";
import { User } from '../entity/User';
import { Project } from "../entity/Project";
import * as jwt from 'jsonwebtoken';
import fs from 'fs';
const privateKey = fs.readFileSync('config/private.key');
const projectRouter = express.Router();


projectRouter.use((req:Request, _res:Response, next) => {
    if (!global.argv.nm) {
      const date = moment(Date.now());
      console.log('/project', req.url)
      console.log('Time: ', date.format("dddd, MMMM Do YYYY, h:mm:ss a"));
    }
    next();
  });

projectRouter.use((req:Request, res:Response, next)=>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null)
    {
      logger.info(`Request without token in node possible hacker attack`);
      return res.sendStatus(401)  
    } 

    jwt.verify(token, privateKey, (err: any, data: any) => {
      if (err){
       logger.info(`Authorization error`,err);
       return res.sendStatus(403)
      }
      next()
    })
  });

  projectRouter.get('/getAll',async (req:Request,res:Response)=>{
    const id = parseInt(decodeURI(<string>req.query.id));
    try {
      const projectRepository=AppDataSource.getRepository(Project);
      const projects=await projectRepository.find({relations:{user:true},where:{user:{id:id}}});
      res.status(200).json(projects); 
    } catch (error) {
    }
  });

  projectRouter.post('/add',async (req:Request,res:Response)=>{
    if(req.body.data===undefined){
        res.status(400).json({message:'Bad formed post'});
        return;
    }
    const {user_id,name,description}=req.body.data
    try {
        if(user_id===undefined || name===undefined || description===undefined){
            res.status(400).json({message:'Bad formed post'});
            return;
        }
        const userRepository=AppDataSource.getRepository(User);
        const projectRepository=AppDataSource.getRepository(Project);
        const user=await userRepository.findOne({where:{id:user_id}});
        let project=new Project();
        project.name=name;
        project.description=description;
        project.user=user;
        projectRepository.save(project);
        res.status(200).json(project); 
        return;
      
    } catch (error) {
    }
  });

  export {projectRouter}