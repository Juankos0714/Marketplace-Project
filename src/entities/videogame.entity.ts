import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Cart } from "./cart.entity";

@Entity("videogames")
export class Videogame {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column("text")
  description: string;

  @Column("simple-array")
  genre: string[];

  @Column("simple-array")
  platform: string[];

  @Column()
  publisher: string;

  @Column("timestamp")
  releaseDate: Date;

  @Column("decimal", { precision: 3, scale: 1 })
  rating: number;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column()
  imageUrl: string;

  @Column()
  inStock: boolean;

  @OneToMany(() => Cart, (cart) => cart.videogame)
  carts: Cart[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}