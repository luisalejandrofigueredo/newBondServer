import yargs, { describe, env, options } from 'yargs'
import express, { Request, Response } from 'express';
import { argv } from 'node:process';
import moment from '../../node_modules/moment/moment';
import { AppDataSource } from "../data-source"
import { logger } from "../utils/utils";
import { User } from '../entity/User';
import * as bcrypt  from 'bcrypt'
import * as jwt from 'jsonwebtoken';
import fs from 'fs';
const privateKey = fs.readFileSync('config/private.key');
const loginRouter = express.Router();

loginRouter.use((req, res, next) => {
    if (!global.argv.nm) {
        const date = moment(Date.now());
        console.log('/login', req.url)
        console.log('Time: ', date.format("dddd, MMMM Do YYYY, h:mm:ss a"));
    }
    next();
});

loginRouter.post('/login', async (req: Request, res: Response) => {
    const { login, password } = req.body
    try {
        if (login === undefined || password === undefined) {
            logger.info(`Possible hacker attack in login ${req.ip}`);
            res.status(400).json({ message: 'Bad request' })
            return;
        }
        const nodeRepository = AppDataSource.getRepository(User);
        const user = await nodeRepository.findOneBy({login:login});
        if (user===null){
            logger.info(`Possible hacker attack in login ${req.ip} bad login ${login}`);
            res.status(401).json({ message: "Unauthorized bad login or password"})
            return;
        }
        if (user.try>5){
            logger.info(`User disabled max login ${req.ip} b${login}`);
            res.status(401).json({ message: "Unauthorized"})
            return;
        }
        const result= await bcrypt.compare(password,user.password);
        if (result===true){
            const webToken=jwt.sign({login:login,ip:req.ip,url:req.originalUrl},privateKey,{expiresIn:"60 days"});
            res.status(200).json({ webToken:webToken });
            return;
        } else {
            logger.info(`Possible hacker attack in login ${req.ip} bad password for  ${login}`);
            user.try++;
            nodeRepository.save(user);
            res.status(401).json({ message: "Unauthorized bad login or password"});
            return;
        }
    } catch (error) {
        logger.info(`Internal server error in login`,error);
        res.status(500).json({ status: "Internal server error" });
    }
});

export {loginRouter}
