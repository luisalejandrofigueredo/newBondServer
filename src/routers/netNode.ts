import { argv } from 'node:process';
import yargs, { describe, env, options } from 'yargs'
import moment from '../../node_modules/moment/moment';
import express, { Request, Response } from 'express';
import { AppDataSource } from "../data-source"
import { logger } from "../utils/utils";
import { Node } from '../entity/Node';
import { NetNode } from "../entity/NetNode";
import * as jwt from 'jsonwebtoken';
import fs from 'fs';
const privateKey = fs.readFileSync('config/private.key');
const netNodeRouter = express.Router();

netNodeRouter.use((req: Request, _res: Response, next) => {
    if (!global.argv.nm) {
        const date = moment(Date.now());
        console.log('/netNode', req.url)
        console.log('Time: ', date.format("dddd, MMMM Do YYYY, h:mm:ss a"));
    }
    next();
});

netNodeRouter.use((req: Request, res: Response, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token === null) {
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

netNodeRouter.post('/add', async (req: Request, res: Response) => {
    if (req.body.data === undefined) {
        res.status(400).json({ message: 'Bad formed post' });
        return;
    };
    const { id } = req.body.data;
    console.log('Console',id);
    const nodeRepository = AppDataSource.getRepository(Node);
    const netNodeRepository = AppDataSource.getRepository(NetNode);
    let netNode = new NetNode();
    nodeRepository.findOne({ where: { id: id } }).then((node) => {
        netNode.node = node;
        netNodeRepository.save(netNode);
    });
});

export { netNodeRouter };