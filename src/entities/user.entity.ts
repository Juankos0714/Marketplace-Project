import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IsEmail, MinLength } from "class-validator";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @MinLength(6)
  password: string;

  @Column({
    type: "enum",
    enum: ["user", "admin"],
    default: "user"
  })
  role: "user" | "admin";

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}