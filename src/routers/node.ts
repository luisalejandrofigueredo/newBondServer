import yargs, { describe, options } from 'yargs'
import express, { Request, Response } from 'express';
import { argv } from 'node:process';
const nodeRouter = express.Router();
import moment from '../../node_modules/moment/moment';
import { AppDataSource } from "../data-source"
import { Node } from "../entity/Node"


nodeRouter.use((req, res, next) => {
    if (!global.argv.nm) {
      const date = moment(Date.now());
      console.log('/node', req.url)
      console.log('Time: ', date.format("dddd, MMMM Do YYYY, h:mm:ss a"));
    }
    next();
  });

  nodeRouter.put('/update', async (req: Request, res: Response) => {
    const id = parseInt(decodeURI(<string>req.query.id));
    try {
      const {name,net,description,visible,x,y}=req.body.data
      const nodeRepository=AppDataSource.getRepository(Node);
      const node=await nodeRepository.findOneBy({id:id});
      node.name=name;
      node.net=net;
      node.description=description;
      node.visible=visible;
      node.x=x;
      node.y=y;
      nodeRepository.save(node).then((updateNode)=>{
        res.status(200).json(updateNode);
      });
    } catch (error) {
      res.status(500).json({ status: "Internal server error" });
    }
  });

  nodeRouter.post('/add', async (req: Request, res: Response) => {
    try {
      let node =new Node();
      const {name,net,description,visible,x,y}=req.body.data
      node.name=name;
      node.net=net;
      node.description=description;
      node.visible=visible;
      node.x=x;
      node.y=y;
      await AppDataSource.manager.save(node).then((response)=>{
        res.status(200).json(response);
      });
    } catch (error) {
      res.status(500).json({ status: "Internal server error" });
    }
   });

   nodeRouter.get('/getOneById', async (req: Request, res: Response) => {
    const id = parseInt(decodeURI(<string>req.query.id));
    try {
      const nodeRepository=AppDataSource.getRepository(Node);
      const node=await nodeRepository.findOneBy({id:id});
      res.status(200).json(node);
    } catch (error) {
      res.status(500).json({ status: "Internal server error" });
    }
  });

  nodeRouter.get('/getAll', async (req: Request, res: Response) => {
    try {
      const nodeRepository=AppDataSource.getRepository(Node);
      const node=await nodeRepository.find();
      res.status(200).json(node);
    } catch (error) {
      res.status(500).json({ status: "Internal server error" });
    }
  });

  nodeRouter.delete('/delete', async (req: Request, res: Response) => {
    const id = parseInt(decodeURI(<string>req.query.id));
    try {
      const nodeRepository=AppDataSource.getRepository(Node);
      const node=await nodeRepository.findOneBy({id:id});
      nodeRepository.remove(node).then((nodeRemoved)=>{
        res.status(200).json(nodeRemoved);
      })
    } catch (error) {
      res.status(500).json({ status: "Internal server error" });
    }
  });
  

  export { nodeRouter};
