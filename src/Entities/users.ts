import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Reviews } from "./Reviews"

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  user_id: number

  @Column()
  login: string

  @Column()
  password: string

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  birthday: Date

  @Column({ default: 0 })
  role: number

  @Column({ nullable: true })
  refresh_token: string

  @OneToMany(() => Reviews, reviews => reviews.user) 
  reviews: Reviews[]
}