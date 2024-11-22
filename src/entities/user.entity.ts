// src/entities/user.entity.ts
import { 
  Table, 
  Column, 
  Model, 
  PrimaryKey, 
  AutoIncrement, 
  HasMany,
  CreatedAt,
  UpdatedAt,
  DataType
} from 'sequelize-typescript';
import { Cart } from './cart.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true
})
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.BIGINT.UNSIGNED,
    allowNull: false
  })
  id!: number;

  @Column({
    type: DataType.STRING(255),
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  })
  email!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  password!: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    defaultValue: UserRole.USER
  })
  role!: UserRole;

  @HasMany(() => Cart)
  carts!: Cart[];

  // Método de asociación estático
  static associate(models: any) {
    this.hasMany(models.Cart, {
      foreignKey: 'userId',
      as: 'carts'
    });
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }
}