import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from "typeorm"
import { Relation } from "../entity/Relation";
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

}