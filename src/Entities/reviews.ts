import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Movies } from "./Movies"
import { Users } from "./Users"

@Entity()
export class Reviews {
  @PrimaryGeneratedColumn()
  reviews_id: number

  @Column()
  rating: number

  @Column()
  comment: string

  @ManyToOne(() => Movies, movies => movies.reviews)
  movie: Movies

  @ManyToOne(() => Users, users => users.reviews)
  user: Users
}