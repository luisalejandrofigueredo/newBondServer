import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index, ManyToOne } from "typeorm"
import { Relation } from "./Relation";

@Entity()
export class eventCon {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string
    @Column()
    description: string
    @ManyToOne(() => Relation, (relation) => relation.eventCones)
    relation: Relation
}