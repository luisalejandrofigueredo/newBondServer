import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, OneToMany } from "typeorm"
import { Node } from './Node';
import { Project } from "./Project";
import { eventCon } from "./eventsCon";
@Index(["from", "to"], { unique: true })
@Entity()
export class Relation {
    @PrimaryGeneratedColumn()
    id: number
    @Index()
    @Column()
    name:string
    @Column()
    description:string
    @ManyToOne(() => Node, (node) => node.relationsFrom)
    from: Node

    @ManyToOne(() => Node, (node) => node.relationsTo)
    to: Node

    @ManyToOne(()=>Project, (project) =>project.relations)
    project:Project

    @OneToMany(()=>eventCon, (eventCone) =>eventCone.relation,{cascade:true})
    eventCones:eventCon[]

}
