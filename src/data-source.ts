import "reflect-metadata"
import { DataSource } from "typeorm"
import { Node } from "./entity/Node"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "test",
    synchronize: true,
    logging: false,
    entities: [Node],
    migrations: [],
    subscribers: [],
})
