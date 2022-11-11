import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, OneToMany } from "typeorm"
import { User } from "./User";
import { Relation } from "./Relation";
@Entity()
@Index(["name","user"],{unique:true})
export class Project {
    @PrimaryGeneratedColumn()
    id: number

    @Index()
    @Column()
    name:string

    @Column()
    description:string

    @ManyToOne(() => User, (user) => user.project,{onDelete:"CASCADE"})
    user:User

    @OneToMany(()=> Relation, (relation) =>relation)
    relations:Relation[]

}

