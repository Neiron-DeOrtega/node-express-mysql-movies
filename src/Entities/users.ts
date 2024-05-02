import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 50,
        unique: true
    })
    login: string

    @Column({
        length: 50
    })
    name: string

    @Column({
        length: 50,
        unique: true
    })
    email: string

    @Column()
    birthday: string

    @Column({
        unique: true
    })
    role: string

    @Column()
    refresh_token: string
}