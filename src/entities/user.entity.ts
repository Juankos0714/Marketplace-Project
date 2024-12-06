import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  HasMany
} from 'sequelize-typescript';
import { Cart } from './cart.entity';

// Mantenemos el enum UserRole
export enum UserRole {
  USER = "user",
  ADMIN = "admin"
}

@Table({
  tableName: 'users',
  timestamps: true
})
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: {
        msg: "Invalid email format"
      }
    }
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6, 100],
        msg: "Password must be at least 6 characters long"
      }
    }
  })
  password: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    defaultValue: UserRole.USER,
    validate: {
      isIn: {
        args: [Object.values(UserRole)],
        msg: "Invalid role type"
      }
    }
  })
  role: UserRole;

  @HasMany(() => Cart)
  carts: Cart[];

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at'
  })
  createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'updated_at'
  })
  updatedAt: Date;

  // Método para las asociaciones
  static associate(models: any) {
    User.hasMany(models.Cart, {
      foreignKey: 'userId',
      as: 'carts'
    });
  }

  // Método helper para verificar si es admin
  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  // Puedes agregar más métodos de instancia aquí según necesites
}