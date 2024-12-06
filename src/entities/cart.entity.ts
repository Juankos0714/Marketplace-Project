import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DataType,
  CreatedAt,
  UpdatedAt,
  Index,
  Unique
} from 'sequelize-typescript';
import { User } from './user.entity';
import { Videogame } from './videogame.entity';

@Table({
  tableName: 'carts',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'videogameId']  // Equivalente al @Unique de TypeORM
    }
  ]
})
export class Cart extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id: number;

  @ForeignKey(() => User)
  @Index  // Mejora performance en búsquedas por usuario
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'user_id'
  })
  userId: number;

  @BelongsTo(() => User, {
    onDelete: 'CASCADE'  // Si se elimina el usuario, se elimina su carrito
  })
  user: User;

  @ForeignKey(() => Videogame)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'videogame_id'
  })
  videogameId: number;

  @BelongsTo(() => Videogame, {
    onDelete: 'CASCADE'
  })
  videogame: Videogame;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1  // Asegura que la cantidad siempre sea positiva
    }
  })
  quantity: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    field: 'unit_price'
  })
  unitPrice: number;

  @Column({
    type: DataType.STRING(20),
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'saved_for_later', 'removed']]
    }
  })
  status: 'pending' | 'saved_for_later' | 'removed';

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

  // Método de ayuda para calcular el precio total
  getTotalPrice(): number {
    return this.quantity * this.unitPrice;
  }

  // Métodos adicionales que Sequelize necesita para las relaciones
  static associate(models: any) {
    Cart.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Cart.belongsTo(models.Videogame, {
      foreignKey: 'videogameId',
      as: 'videogame'
    });
  }
}