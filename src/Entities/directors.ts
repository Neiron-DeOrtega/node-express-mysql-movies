import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from "typeorm"
import { Movies } from "./Movies"

@Entity()
export class Directors {
  @PrimaryGeneratedColumn()
  director_id: number

  @Column()
  director_name: string

  @ManyToMany(() => Movies, movies => movies.director)
  movies: Movies[]
}