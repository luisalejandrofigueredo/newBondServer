import yargs, { describe, options } from 'yargs'
import express, { Request, Response } from 'express';
import { argv } from 'node:process';
import moment from 'moment/moment';
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import * as bcrypt  from 'bcrypt'
import { logger } from "../utils/utils";
const testRouter = express.Router();

testRouter.post('/addUser', async (req: Request, res: Response) => {
    try {
      let user =new User();
      user.login='root'
      user.password=await bcrypt.hash('root',10);
      user.name='Luis';
      user.try=0;
      await AppDataSource.manager.save(user).then((response)=>{
        res.status(200).json(response);
      });
    } catch (error) {
      logger.info(`Internal server error in test add user`,error);
      res.status(500).json({ status: "Internal server error" });
    }
   });

   export {testRouter}