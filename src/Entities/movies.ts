import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany } from "typeorm"
import { Actors } from "./Actors"
import { Directors } from "./Directors"
import { Genres } from "./Genres"
import { Reviews } from "./Reviews"

@Entity()
export class Movies {
  @PrimaryGeneratedColumn()
  movies_id!: number

  @Column()
  movie_name!: string

  @Column()
  release_date!: number

  @Column()
  movie_logo!: string

  @Column()
  description!: string

  @ManyToMany(() => Genres, genres => genres.movies)
  genres!: Genres[]

  @ManyToMany(() => Directors, directors => directors.movies)
  director!: Directors[]

  @ManyToMany(() => Actors, actors => actors.movies)
  actors!: Actors[]

  @OneToMany(() => Reviews, reviews => reviews.movie)
  reviews!: Reviews[]
}
