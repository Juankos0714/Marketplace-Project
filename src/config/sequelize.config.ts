// src/config/sequelize.config.ts
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import { User } from '../entities/user.entity';
import { Videogame } from '../entities/videogame.entity';
import { Cart } from '../entities/cart.entity';
import dotenv from 'dotenv';
import parseUrl from 'parse-url';

dotenv.config();

const env = process.env.NODE_ENV || 'development';

const baseConfig: SequelizeOptions = {
  models: [User, Videogame, Cart],
  define: {
    timestamps: true,
    underscored: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
  },
  dialect: 'mysql',
  dialectModule: require('mysql2'),
  logging: env === 'development' ? console.log : false,
};

const configs: { [key: string]: SequelizeOptions } = {
  development: {
    ...baseConfig,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'videogames_db',
  },
  production: {
    ...baseConfig,
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

// Función para crear la instancia de Sequelize
const createSequelizeInstance = (): Sequelize => {
  // Prioriza la conexión por URL de Railway
  if (process.env.RAILWAY_TCP_PROXY_URL) {
    try {
      // Parsea la URL de conexión de Railway
      const parsedUrl = parseUrl(process.env.RAILWAY_TCP_PROXY_URL);
      
      return new Sequelize({
        ...baseConfig,
        host: parsedUrl.resource,
        port: parseInt(parsedUrl.port || '3306'),
        username: parsedUrl.user,
        password: parsedUrl.password,
        database: parsedUrl.pathname.replace('/', ''),
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      });
    } catch (error) {
      console.error('Error al parsear la URL de conexión:', error);
    }
  }

  // Usa la configuración basada en variables de entorno separadas
  if (env === 'production') {
    return new Sequelize({
      ...configs.production,
      host: process.env.RAILWAY_HOST || '',
      port: parseInt(process.env.RAILWAY_PORT || '3306'),
      username: process.env.RAILWAY_USER || '',
      password: process.env.RAILWAY_PASSWORD || '',
      database: process.env.RAILWAY_DATABASE || '',
    });
  }

  // Fallback a la configuración de desarrollo
  return new Sequelize(configs.development);
};

export const sequelize = createSequelizeInstance();

// Función de depuración del esquema de base de datos
const debugDatabaseSchema = async () => {
  try {
    const [results] = await sequelize.query(
      "SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, COLUMN_TYPE " +
      "FROM INFORMATION_SCHEMA.COLUMNS " +
      "WHERE TABLE_SCHEMA = :dbName",
      {
        replacements: { dbName: process.env.RAILWAY_DATABASE || process.env.DB_NAME },
        type: QueryTypes.SELECT
      }
    );

    console.log('Esquema de la base de datos:');
    console.table(results);
  } catch (error) {
    console.error('Error al depurar el esquema de la base de datos:', error);
  }
};

export const initDatabase = async () => {
  try {
    console.log('Intentando conectar con la base de datos...');
    console.log('Entorno:', env);
    
    // Log de las variables de conexión para depuración
    console.log('Variables de conexión:', {
      HOST: process.env.RAILWAY_HOST || process.env.RAILWAY_TCP_PROXY_URL,
      PORT: process.env.RAILWAY_PORT,
      USER: process.env.RAILWAY_USER,
      DATABASE: process.env.RAILWAY_DATABASE
    });

    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');

    // Usar alter: true para modificar tablas existentes de manera segura
    await sequelize.sync({ 
      alter: {
        drop: false
      },
      logging: console.log
    });

    console.log('✅ Modelos sincronizados.');

    setupAssociations();

    // Opcional: Descomentar para depurar el esquema
    // await debugDatabaseSchema();

  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    
    // Log detallado de errores
    if (error instanceof Error) {
      console.error('Detalles del error completos:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });

      // Si es un error de Sequelize, muestra detalles adicionales
      if ('parent' in error) {
        console.error('Error de base de datos:', (error as any).parent);
      }
    }
    
    throw error;
  }
};
const setupAssociations = () => {
  // Asociaciones entre User y Cart
  User.hasMany(Cart, {
    foreignKey: {
      name: 'userId',
      allowNull: false
    },
    as: 'carts',
    onDelete: 'CASCADE'
  });
  
  Cart.belongsTo(User, {
    foreignKey: {
      name: 'userId',
      allowNull: false
    },
    as: 'user',
    onDelete: 'CASCADE'
  });

  // Asociaciones entre Videogame y Cart
  Videogame.hasMany(Cart, {
    foreignKey: {
      name: 'videogameId',
      allowNull: false
    },
    as: 'cartItems',
    onDelete: 'CASCADE'
  });
  
  Cart.belongsTo(Videogame, {
    foreignKey: {
      name: 'videogameId',
      allowNull: false
    },
    as: 'videogame',
    onDelete: 'CASCADE'
  });
};

// Tipo de exportación para conexión de base de datos
export type DbConnection = typeof sequelize;