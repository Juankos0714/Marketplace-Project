// src/types/database.types.ts
export interface DatabaseConfig {
    username?: string;
    password?: string;
    database?: string;
    host?: string;
    port?: number;
    url?: string;
    dialect: 'mysql';
    dialectModule: any;
    logging: boolean | ((sql: string) => void);
    dialectOptions?: {
      ssl?: {
        require: boolean;
        rejectUnauthorized: boolean;
      };
    };
    pool?: {
      max: number;
      min: number;
      acquire: number;
      idle: number;
    };
  }
  
  export interface Config {
    development: DatabaseConfig;
    production: DatabaseConfig;
  }