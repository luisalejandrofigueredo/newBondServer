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


  nodeRouter.post('/addNode', async (req: Request, res: Response) => {
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
   });

  export { nodeRouter};
