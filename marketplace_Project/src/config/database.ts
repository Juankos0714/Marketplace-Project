import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";
import { Videogame } from "../entities/videogame.entity";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // En producción debería ser false
  logging: true,
  entities: [User, Videogame],
  migrations: [],
  subscribers: [],
});
