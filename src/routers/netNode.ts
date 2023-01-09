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


netNodeRouter.get('/getNetNode', async (req: Request, res: Response) => {
    const id = parseInt(decodeURI(<string>req.query.id));
    const netNodeRepository = AppDataSource.getRepository(NetNode);
    netNodeRepository.findOne({ where: { id: id },relations:{netNode:true,nodeChildren:true} }).then((netNode) => {
        res.status(200).json(netNode);
    });
});

netNodeRouter.post('/add', async (req: Request, res: Response) => {
    if (req.body.data === undefined) {
        res.status(400).json({ message: 'Bad formed post' });
        return;
    };
    const { id, toId } = req.body.data;
    const nodeRepository = AppDataSource.getRepository(Node);
    const netNodeRepository = AppDataSource.getRepository(NetNode);
    let netNode = new NetNode();
    await nodeRepository.findOne({ where: { id: toId } }).then(async (toNode) => {
        netNode.nodeChildren=toNode
        await nodeRepository.findOne({ where: { id: id } }).then(async (node) => {
            netNode.netNode = node;
        })
    })
    await nodeRepository.findOne({ where: { id: id }, relations: { netNodes: true } }).then(async (node) => {
        await netNodeRepository.save(netNode).then(async (sNetNode) => {
            if (node.netNodes === null) {
                node.netNodes = new Array<NetNode>();
            }
            node.netNodes.push(sNetNode);
            await nodeRepository.save(node).then((sNode) => {
            });
            res.status(200).json(sNetNode);
        });
    });
});

export { netNodeRouter };