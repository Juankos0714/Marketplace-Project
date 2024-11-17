import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { IsEmail, MinLength, IsEnum } from "class-validator";
import { Cart } from "./cart.entity";

export enum UserRole {
  USER = "user",
  ADMIN = "admin"
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @Column()
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  password: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER
  })
  @IsEnum(UserRole, { message: "Invalid role type" })
  role: UserRole;

  @OneToMany(() => Cart, cart => cart.user)
  carts: Cart[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}