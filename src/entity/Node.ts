import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index, ManyToOne } from "typeorm"
import { Relation } from "../entity/Relation";
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


    @OneToMany(() => Relation, (relation) => relation.from) 
    relationsFrom: Relation[]

    @OneToMany(() => Relation, (relation) => relation.to) 
    relationsTo: Relation[]

    @ManyToOne(()=> Project,(project)=>project.id)
    project:Project

}