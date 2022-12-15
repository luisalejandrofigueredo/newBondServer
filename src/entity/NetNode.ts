import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index, ManyToOne } from "typeorm";
import { Node } from "../entity/Node";
@Entity()
export class NetNode {
    @PrimaryGeneratedColumn()
    id: number
    @ManyToOne(()=> Node,(node)=>node.netNode)
    node:Node
}