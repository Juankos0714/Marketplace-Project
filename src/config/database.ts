import { DataSource } from "typeorm";
import { User } from "../dto/user.entity";
import { Videogame } from "../dto/videogame.dto";
import { Cart } from "../dto/cart.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "videogame_shop",
  synchronize: true,
  logging: process.env.NODE_ENV === "development",
  entities: [User, Videogame, Cart],
  subscribers: [],
  migrations: [],
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established");
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
};