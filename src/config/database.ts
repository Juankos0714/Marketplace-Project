// src/config/database.ts
import { Sequelize } from 'sequelize-typescript';
import { User } from '../dto/user.entity';
import { Videogame } from '../dto/videogame.dto';
import { Cart } from '../dto/cart.entity';
import dotenv from 'dotenv';

dotenv.config();

// Railway proporciona una URL de conexión completa
const DATABASE_URL = process.env.DATABASE_URL;

// Configuración de Sequelize para Railway
export const sequelize = new Sequelize(DATABASE_URL || '', {
  dialect: 'mysql',
  dialectModule: require('mysql2'), // Específico para mysql2
  models: [User, Videogame, Cart],
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  // Opciones adicionales para Railway
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // En caso de que Railway use un certificado auto-firmado
    }
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false
});

// Función para probar la conexión
export const testDatabaseConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión establecida correctamente con Railway.');
    
    // Sincronizar modelos con la base de datos
    await sequelize.sync({ alter: true }); // usar con precaución en producción
    console.log('✅ Modelos sincronizados con la base de datos.');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    throw error;
  }
};