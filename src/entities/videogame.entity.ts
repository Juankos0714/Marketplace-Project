import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  CreatedAt,
  UpdatedAt,
  Default
} from 'sequelize-typescript';
import { Cart } from './cart.entity';

@Table({
  tableName: 'videogames',
  timestamps: true
})
export class Videogame extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    defaultValue: DataType.UUIDV4
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  description: string;

  @Column({
    type: DataType.TEXT,
    get() {
      const rawValue = this.getDataValue('genre');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value: string[]) {
      this.setDataValue('genre', JSON.stringify(value));
    }
  })
  genre: string[];

  @Column({
    type: DataType.TEXT, // Usando JSON para arrays
    get() {
      const rawValue = this.getDataValue('platform');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value: string[]) {
      this.setDataValue('platform', JSON.stringify(value));
    }
  })
  platform: string[];

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  publisher: string;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  releaseDate: Date;

  @Column({
    type: DataType.DECIMAL(3, 1),
    validate: {
      min: 0,
      max: 10
    }
  })
  rating: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    validate: {
      min: 0
    }
  })
  price: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  imageUrl: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  inStock: boolean;

  @HasMany(() => Cart)
  cartItems: Cart[];

  @CreatedAt
  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    field: 'created_at'
  })
  createdAt: Date;

  @UpdatedAt
  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    field: 'updated_at'
  })
  updatedAt: Date;

  // Método para las asociaciones
  static associate(models: any) {
    Videogame.hasMany(models.Cart, {
      foreignKey: 'videogameId',
      as: 'cartItems'
    });
  }

  // Métodos helper útiles
  isAvailable(): boolean {
    return this.inStock;
  }

  getFormattedPrice(): string {
    return `$${this.price.toFixed(2)}`;
  }

  getGenresString(): string {
    return this.genre.join(', ');
  }

  getPlatformsString(): string {
    return this.platform.join(', ');
  }
}
