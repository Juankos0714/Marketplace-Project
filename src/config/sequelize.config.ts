// src/config/sequelize.config.ts
import { Sequelize } from 'sequelize-typescript';
import { User } from '../entities/user.entity';
import { Videogame } from '../entities/videogame.entity';
import { Cart } from '../entities/cart.entity';
import dotenv from 'dotenv';

dotenv.config();

// Configuración para diferentes entornos
const config = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'videogames_db',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    logging: console.log
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    logging: false,
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
    }
  }
};

// Determinar el entorno actual
const env = process.env.NODE_ENV || 'development';
const currentConfig = env === 'production' ? config.production : config.development;

// Crear instancia de Sequelize
export const sequelize = new Sequelize({
  ...currentConfig,
  models: [User, Videogame, Cart], // Tus modelos
  define: {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
    underscored: true, // Usa snake_case para nombres de columnas
    freezeTableName: true, // Evita que Sequelize pluralice los nombres de tablas
  },
  // Opciones adicionales de sincronización
  sync: {
    // alter: true, // En desarrollo, permite alteraciones de tabla
    // force: false, // En producción, NUNCA usar force: true
  }
});

// Función para inicializar la base de datos
export const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');

    // Sincronizar modelos
    if (env === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Modelos sincronizados con la base de datos.');
    } else {
      await sequelize.sync(); // En producción, solo sync normal
      console.log('✅ Modelos verificados en la base de datos.');
    }

  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    throw error;
  }
};

// Exportar tipos útiles
export type DbConnection = typeof sequelize;