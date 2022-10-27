import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from "typeorm"
import { Node } from './Node';
@Index(["from", "to"], { unique: true })
@Entity()
export class Relation {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Node, (node) => node.relationsFrom)
    from: Node

    @ManyToOne(() => Node, (node) => node.relationsTo)
    to: Node

    description:string
}
