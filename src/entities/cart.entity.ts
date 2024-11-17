import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    Index,
    Check,
    Unique
  } from 'typeorm';
  import { User } from './user.entity';
  import { Videogame } from './videogame.entity';
  
  @Entity('carts')
  @Unique(['user', 'videogame']) // Evita duplicados del mismo juego para un usuario
  @Check(`"quantity" > 0`) // Asegura que la cantidad siempre sea positiva
  export class Cart {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, user => user.cart, {
      nullable: false,
      onDelete: 'CASCADE' // Si se elimina el usuario, se elimina su carrito
    })
    @JoinColumn({ name: 'user_id' })
    @Index() // Mejora performance en búsquedas por usuario
    user: User;
  
    @ManyToOne(() => Videogame, videogame => videogame.cartItems, {
      nullable: false,
      onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'videogame_id' })
    videogame: Videogame;
  
    @Column({
      type: 'int',
      default: 1
    })
    quantity: number;
  
    @Column({
      type: 'decimal',
      precision: 10,
      scale: 2,
      name: 'unit_price'
    })
    unitPrice: number;
  
    @Column({
      type: 'varchar',
      length: 20,
      default: 'pending'
    })
    status: 'pending' | 'saved_for_later' | 'removed';
  
    @CreateDateColumn({
      type: 'timestamp',
      name: 'created_at'
    })
    createdAt: Date;
  
    @UpdateDateColumn({
      type: 'timestamp',
      name: 'updated_at'
    })
    updatedAt: Date;
  
    // Método de ayuda para calcular el precio total
    getTotalPrice(): number {
      return this.quantity * this.unitPrice;
    }
  }