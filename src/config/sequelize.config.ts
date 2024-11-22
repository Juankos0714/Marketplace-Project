// src/config/sequelize.config.ts
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
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
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  },
  dialect: 'mysql',
  dialectModule: require('mysql2'),
  logging: env === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 60000, // Time Sequelize waits for a connection to be established
    idle: 10000, // Time before an idle connection is released
  },
  dialectOptions: {
    connectTimeout: 60000, // MySQL connection timeout
    ssl: process.env.DB_SSL === 'true' ? {
      require: true,
      rejectUnauthorized: false, // For self-signed certificates
    } : undefined,
  },
};

const configs: { [key: string]: SequelizeOptions } = {
  development: {
    ...baseConfig,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'videogames_db',
  },
  production: {
    ...baseConfig,
    host: process.env.MYSQLHOST || 'localhost',
    port: parseInt(process.env.MYSQLPORT || '3306', 10),
    username: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    pool: {
      max: 10, // Increased for production
      min: 2,
      acquire: 60000,
      idle: 10000,
    },
  },
};

const createSequelizeInstance = (): Sequelize => {
  const config = env === 'production' ? configs.production : configs.development;

  console.log(
    `Conectando en modo ${env}...`,
    `URL de conexión: ${process.env.MYSQL_URL ? 'Disponible' : 'No disponible'}`,
  );

  return process.env.MYSQL_URL
    ? new Sequelize(process.env.MYSQL_URL, config)
    : new Sequelize(config);
};

export const sequelize = createSequelizeInstance();

export const initDatabase = async (): Promise<void> => {
  let retries = 3;
  while (retries > 0) {
    try {
      console.log(`Intentando conectar con la base de datos... (intentos restantes: ${retries})`);
      await sequelize.authenticate();
      console.log('✅ Conexión a la base de datos establecida correctamente.');

      await sequelize.sync({ alter: true });
      console.log('✅ Modelos sincronizados.');

      setupAssociations();
      return;

      } catch (error) {
        retries--;
        console.error(`❌ Error al conectar (intentos restantes: ${retries}):`, (error as Error).message);
        if (retries > 0) {
          console.log('Reintentando en 5 segundos...');
          await new Promise((res) => setTimeout(res, 5000));
        } else {
          console.error('Se agotaron los intentos de conexión.');
          throw error; // Re-throw the original error
        }
      }
      
  }
};

const setupAssociations = (): void => {
  User.hasMany(Cart, {
    foreignKey: { name: 'userId', allowNull: false },
    as: 'carts',
    onDelete: 'CASCADE',
  });

  Cart.belongsTo(User, {
    foreignKey: { name: 'userId', allowNull: false },
    as: 'user',
    onDelete: 'CASCADE',
  });

  Videogame.hasMany(Cart, {
    foreignKey: { name: 'videogameId', allowNull: false },
    as: 'cartItems',
    onDelete: 'CASCADE',
  });

  Cart.belongsTo(Videogame, {
    foreignKey: { name: 'videogameId', allowNull: false },
    as: 'videogame',
    onDelete: 'CASCADE',
  });
};

export const debugDatabaseSchema = async (): Promise<void> => {
  try {
    const [results] = await sequelize.query(
      "SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, COLUMN_TYPE " +
      "FROM INFORMATION_SCHEMA.COLUMNS " +
      "WHERE TABLE_SCHEMA = :dbName",
      {
        replacements: { dbName: process.env.DB_NAME },
        type: QueryTypes.SELECT,
      },
    );
    console.log('Esquema de la base de datos:');
    console.table(results);
  } catch (error) {
    console.error('Error al depurar el esquema:', (error as Error).message);
  }
};
