import { Sequelize } from 'sequelize-typescript';
import { User } from "../dto/user.dto";
import { Videogame } from "../dto/videogame.dto";
import { Cart } from "../dto/cart.dto"
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "videogame_shop",
    logging: process.env.NODE_ENV === "development",
    models: [User, Videogame, Cart], // Tus modelos
    sync: { force: false }, // Equivalente a synchronize: true en TypeORM
    // Opciones adicionales de Sequelize
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

export const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        // Sincroniza los modelos con la base de datos
        await sequelize.sync();
        console.log("Database connection established");
    } catch (error) {
        console.error("Error connecting to database:", error);
        throw error;
    }
};