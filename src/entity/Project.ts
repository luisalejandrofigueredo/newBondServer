import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index, ManyToOne } from "typeorm"
import { User } from "./User";
@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id: number

    @Index()
    @Column()
    name:string

    @Column()
    description:string

    @ManyToOne(() => User, (user) => user.project)
    project:Project

}