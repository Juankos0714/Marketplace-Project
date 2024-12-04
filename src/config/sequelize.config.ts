import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { User } from '../entities/user.entity';
import { Videogame } from '../entities/videogame.entity';
import { Cart } from '../entities/cart.entity';
import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'development';

const baseConfig: SequelizeOptions = {
  models: [User, Videogame, Cart],
  define: {
    timestamps: true,
    underscored: true,
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
  const config = configs[env];
  
  // Si estás en producción, usa la URL de conexión
  if (env === 'production' && process.env.RAILWAY_TCP_PROXY_HOST) {
    const url = new URL(process.env.RAILWAY_TCP_PROXY_HOST);
    return new Sequelize({
      ...config,
      host: url.hostname,
      port: parseInt(url.port || '3306'),
      username: url.username,
      password: url.password,
      database: url.pathname.replace('/', ''),
    });
  }

  return new Sequelize(config);
};

export const sequelize = createSequelizeInstance();

// Función de inicialización de base de datos
export const initDatabase = async () => {
  try {
    console.log('Intentando conectar con la base de datos...');
    console.log('Entorno:', env);

    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');

    // Configuración de sincronización más segura
    if (env === 'development') {
      await sequelize.sync({ force: true });  // Usa force: true con precaución
      console.log('✅ Modelos sincronizados en modo desarrollo.');
    } else {
      await sequelize.sync({ alter: { drop: false } });
      console.log('✅ Modelos verificados en producción.');
    }

    // Configuración de asociaciones manuales
    setupAssociations();

  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    
    // Loguea detalles específicos del error
    if (error instanceof Error) {
      console.error('Detalles del error:', {
        message: error.message,
        stack: error.stack
      });
    }
    
    throw error;
  }
};

// Función para configurar asociaciones manualmente
const setupAssociations = () => {
  User.hasMany(Cart, {
    foreignKey: 'userId',
    as: 'carts'
  });
  Cart.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });

  Videogame.hasMany(Cart, {
    foreignKey: 'videogameId',
    as: 'cartItems'
  });
  Cart.belongsTo(Videogame, {
    foreignKey: 'videogameId',
    as: 'videogame'
  });
};

export type DbConnection = typeof sequelize;
