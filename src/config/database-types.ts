import { DataTypes } from 'sequelize';

export const DatabaseTypes = {
  ID: DataTypes.BIGINT.UNSIGNED,
  STRING: DataTypes.STRING,
  TEXT: DataTypes.TEXT,
  INTEGER: DataTypes.INTEGER,
  DECIMAL: DataTypes.DECIMAL,
  DATE: DataTypes.DATE,
  BOOLEAN: DataTypes.BOOLEAN,
  ENUM: DataTypes.ENUM
};