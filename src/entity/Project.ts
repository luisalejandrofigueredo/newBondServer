import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne } from "typeorm"
import { User } from "./User";
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

    @ManyToOne(() => User, (user) => user.project)
    user:User

}

