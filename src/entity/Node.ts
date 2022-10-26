import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Node {

    @PrimaryGeneratedColumn()
    id: number

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

}