import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { User } from '../entities/user.entity';
import { Videogame } from '../entities/videogame.entity';
import { Cart } from '../entities/cart.entity';
import dotenv from 'dotenv';
dotenv.config();

interface DatabaseConfig {
  development: SequelizeOptions;
  production: SequelizeOptions;
}

const config: DatabaseConfig = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'videogames_db',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    logging: console.log,
    models: [User, Videogame, Cart],
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    }
  },
  production: {
    database: process.env.DB_NAME!,
    username: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    logging: false,
    models: [User, Videogame, Cart],
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    }
  }
};

const env = process.env.NODE_ENV || 'development';
const currentConfig = config[env as keyof DatabaseConfig];

// Crear instancia de Sequelize
export const sequelize = new Sequelize(currentConfig);

// Función para inicializar la base de datos
export const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');

    if (env === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Modelos sincronizados con la base de datos.');
    } else {
      await sequelize.sync();
      console.log('✅ Modelos verificados en la base de datos.');
    }
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    throw error;
  }
};

export type DbConnection = typeof sequelize;