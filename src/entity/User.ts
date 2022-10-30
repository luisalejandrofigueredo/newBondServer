import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from "typeorm"
import { Project } from "./Project";
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string
    @Column()
    login: string
    @Column()
    password: string
    @Column()
    try: number

    @OneToMany(() => Project, (project) => project.project)
    project: Project[]
}