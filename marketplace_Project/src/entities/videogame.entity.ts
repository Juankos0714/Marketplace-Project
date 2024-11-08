import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("videogames")
export class Videogame {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column()
  releaseDate: Date;

  @Column("decimal", { precision: 4, scale: 2 })
  rating: number;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column()
  imageUrl: string;

  @Column({ default: true })
  inStock: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}