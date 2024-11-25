// src/config/sequelize.config.ts
import { Sequelize } from 'sequelize-typescript';
import { User } from '../entities/user.entity';
import { Videogame } from '../entities/videogame.entity';
import { Cart } from '../entities/cart.entity';
import dotenv from 'dotenv';

dotenv.config();

// Crear URL de conexión MySQL
const MYSQL_URL = `mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQLDATABASE}`;

export const sequelize = new Sequelize(MYSQL_URL, {
  dialect: 'mysql',
  dialectModule: require('mysql2'),
  models: [User, Videogame, Cart],
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    connectTimeout: 60000
  },
  logging: false,
  define: {
    timestamps: true,
    underscored: true
  }
});

export const initDatabase = async (): Promise<void> => {
  try {
    console.log('Intentando conectar a MySQL en Railway...');
    await sequelize.authenticate();
    console.log('Conexión establecida correctamente.');
    
    setupAssociations();
    await sequelize.sync();
    console.log('Modelos sincronizados con la base de datos.');
  } catch (error) {
    console.error('Error de conexión:', error);
    throw error;
  }
};

const setupAssociations = (): void => {
  User.hasMany(Cart);
  Cart.belongsTo(User);
  Videogame.hasMany(Cart);
  Cart.belongsTo(Videogame);
};
