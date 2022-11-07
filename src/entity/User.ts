import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from "typeorm"
import { Project } from "./Project";
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string
    @Column({nullable: true})
    login:  string
    @Column({nullable: true})
    password: string
    @Column({default:0})
    try: number

    @OneToMany(() => Project, (project) => project.user,{cascade:true})
    project: Project[]
}