import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm"
import { Movies } from "./Movies"

@Entity()
export class Genres {
  @PrimaryGeneratedColumn()
  genres_id: number

  @Column()
  genre_name: string

  @ManyToMany(() => Movies, movies => movies.genres)
  movies: Movies[]
}
