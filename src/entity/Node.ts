import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index, ManyToOne } from "typeorm"
import { Relation } from "../entity/Relation";
import { NetNode } from "./NetNode";
import { Project } from "./Project";
@Entity()
export class Node {

    @PrimaryGeneratedColumn()
    id: number

    @Index({ unique: true })
    @Column()
    name: string

    @Column()
    description: string

    @Column()
    color: string

    @Column()
    x: number

    @Column()
    y: number

    @Column()
    visible: boolean

    @Column()
    net: boolean
    
    @OneToMany(() => NetNode, (netNode) => netNode.netNode,{onDelete:"CASCADE"}) 
    netNodes:NetNode[]

    @OneToMany(() => NetNode, (netNode) => netNode.nodeChildren,{onDelete:"CASCADE"}) 
    children_s:NetNode[]

    @OneToMany(() => Relation, (relation) => relation.from,{onDelete:"CASCADE"}) 
    relationsFrom: Relation[]

    @OneToMany(() => Relation, (relation) => relation.to,{onDelete:"CASCADE"}) 
    relationsTo: Relation[]

    @ManyToOne(()=> Project,(project)=>project.id)
    project:Project

}