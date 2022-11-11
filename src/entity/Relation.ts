import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from "typeorm"
import { Node } from './Node';
import { Project } from "./Project";
@Index(["from", "to"], { unique: true })
@Entity()
export class Relation {
    @PrimaryGeneratedColumn()
    id: number
    name:string
    description:string
    @ManyToOne(() => Node, (node) => node.relationsFrom)
    from: Node

    @ManyToOne(() => Node, (node) => node.relationsTo)
    to: Node

    @ManyToOne(()=>Project, (project) =>project.relations)
    project:Project

}
