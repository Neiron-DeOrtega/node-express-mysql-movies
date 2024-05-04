import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm"
import { Movies } from "./Movies"

@Entity()
export class Actors {
  @PrimaryGeneratedColumn()
  actors_id: number

  @Column()
  actor_name: string

  @ManyToMany(() => Movies, movies => movies.actors)
  movies: Movies[]
}