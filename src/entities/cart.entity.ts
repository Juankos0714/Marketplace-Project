// src/entities/cart.entity.ts
import { 
  Table, 
  Column, 
  Model, 
  PrimaryKey, 
  AutoIncrement, 
  ForeignKey, 
  BelongsTo, 
  Default,
  DataType
} from 'sequelize-typescript';
import { User } from './user.entity';
import { Videogame } from './videogame.entity';

@Table({
  tableName: 'carts',
  timestamps: true,
  underscored: true
})
export class Cart extends Model<Cart> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.BIGINT.UNSIGNED,
    allowNull: false
  })
  id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT.UNSIGNED,
    allowNull: false,
    field: 'user_id'
  })
  userId!: number;

  @ForeignKey(() => Videogame)
  @Column({
    type: DataType.BIGINT.UNSIGNED,
    allowNull: false,
    field: 'videogame_id'
  })
  videogameId!: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 1
  })
  quantity!: number;

  @Column({
    type: DataType.DECIMAL(10, 2)
  })
  unitPrice!: number;

  @Default('pending')
  @Column({
    type: DataType.STRING(20)
  })
  status!: string;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Videogame)
  videogame!: Videogame;

  // Método de asociación estático
  static associate(models: any) {
    this.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    this.belongsTo(models.Videogame, {
      foreignKey: 'videogameId',
      as: 'videogame'
    });
  }
}