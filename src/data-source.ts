import "reflect-metadata"
import { DataSource } from "typeorm"
import { Node } from "./entity/Node"
import { Relation } from './entity/Relation'
import { User } from "./entity/User";
import { Project } from "./entity/Project";
export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "test",
    synchronize: true,
    logging: false,
    entities: [Node, Relation, User, Project],
    migrations: [],
    subscribers: [],
})
