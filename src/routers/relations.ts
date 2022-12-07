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
import { Node } from '../entity/Node';
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

  relationsRouter.delete('/delete', async (req: Request, res: Response) => {
    const id = parseInt(decodeURI(<string>req.query.id));
    try {
      const relationRepository=AppDataSource.getRepository(Relation);
      const relation=await relationRepository.findOneBy({id:id});
      relationRepository.remove(relation).then((relationRemoved)=>{
        res.status(200).json(relationRemoved);
      })
    } catch (error) {
      logger.info(`Internal server error in node delete`,error);
      res.status(500).json({ message: "Internal server error" });
    }
  });


  relationsRouter.get('/getOne',async (req:Request,res:Response)=>{
    const id = parseInt(decodeURI(<string>req.query.id));
    try {
      const relationsRepository=AppDataSource.getRepository(Relation);
      const relation=await relationsRepository.findOne({
        relations:{from:true,to:true},
        where:{id:id}});
      res.status(200).json(relation); 
    } catch (error) {
    }
  });


  relationsRouter.get('/getAll',async (req:Request,res:Response)=>{
    const id = parseInt(decodeURI(<string>req.query.id));
    try {
      const relationsRepository=AppDataSource.getRepository(Relation);
      const relations=await relationsRepository.find({
        relations:{from:true,to:true},
        where:{project:{id:id}}});
      res.status(200).json(relations);   
    } catch (error) {
    }
  });

  relationsRouter.put('/update', async (req: Request, res: Response) => {
    try {
      const {id,name,description,from,to,mirrorLabel,distance,align}=req.body.data as Relation;
      const relationsRepository=AppDataSource.getRepository(Relation);
      const relation=await relationsRepository.findOneBy({id:id});
      relation.name=name;
      relation.description=description;
      relation.from=from;
      relation.to=to;
      relation.mirrorLabel=mirrorLabel;
      relation.distance=distance;
      relation.align=align;
      relationsRepository.save(relation).then((updateRelation)=>{
        res.status(200).json(updateRelation);
      }).catch((error)=>{
        res.status(200).json({ message: "Duplicate relation" });  
      });
    } catch (error) {
      logger.info(`Internal server error in node update`,error);
      res.status(500).json({ message: "Internal server error" });
    }
  });


  relationsRouter.post('/add',async (req:Request,res:Response)=>{
    if(req.body.data===undefined){
        res.status(400).json({message:'Bad formed post'});
        return;
    }
    const {name,description,from,to,project} =req.body.data as Relation
    try {
        if(name===undefined || description===undefined || from===undefined || to===undefined){
            res.status(400).json({message:'Bad formed post'});
            return;
        }
        const nodeRepository=AppDataSource.getRepository(Node);
        let nodeFrom=new Node();
        nodeFrom.id=from.id;
        nodeFrom.name=from.name;
        nodeFrom.description=from.description;
        nodeFrom.net=from.net;
        nodeFrom.x=from.x;
        nodeFrom.y=from.y;
        nodeFrom.relationsFrom=from.relationsFrom;
        nodeFrom.relationsTo=from.relationsTo;
        nodeFrom.visible=from.visible;
        nodeFrom.project=from.project;
        let nodeTo=new Node();
        nodeTo.id=to.id;
        nodeTo.name=to.name;
        nodeTo.description=to.description;
        nodeTo.net=to.net;
        nodeTo.project=to.project;
        nodeTo.relationsFrom=to.relationsFrom;
        nodeTo.relationsTo=to.relationsTo;
        nodeTo.visible=to.visible;
        nodeTo.x=to.x;
        nodeTo.y=to.y;
        const relationRepository=AppDataSource.getRepository(Relation);
        let relation=new Relation()
        relation.name=name;
        relation.description=description;
        relation.mirrorLabel=false;
        relation.to=nodeTo;
        relation.from=nodeFrom;
        let projectSave=new Project();
        projectSave.id=project.id;
        projectSave.name=project.name;
        projectSave.description=project.description;
        projectSave.relations=project.relations;
        projectSave.user=project.user;
        relation.project=projectSave;
        relationRepository.save(relation).then((newRelation)=>{
          res.status(200).json(newRelation);
          return;
        }).catch((error)=>{
          res.status(200).json({ message:"Duplicate value"});
          return;
        });
    } catch (error) {
    }
  });
export {relationsRouter}