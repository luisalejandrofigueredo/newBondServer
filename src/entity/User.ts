import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from "typeorm"
import { Project } from "./Project";
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    name:string

    login:string

    password:string

    @OneToMany(() => Project, (project) => project.project) 
    project: Project[]
}