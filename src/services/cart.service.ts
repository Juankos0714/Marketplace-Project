import { HttpException, HttpStatus } from '@nestjs/common';
import { AppDataSource } from '../config/database';
import { Cart } from '../entities/cart.entity';
import { User } from '../entities/user.entity';
import { Videogame } from '../entities/videogame.entity';
import { AddToCartDto } from '../dto/cart.dto';

export class CartService {
  private cartRepository = AppDataSource.getRepository(Cart);
  private userRepository = AppDataSource.getRepository(User);
  private videogameRepository = AppDataSource.getRepository(Videogame);

  public async addToCart(userId: number, cartData: AddToCartDto): Promise<Cart> {
    try {
      // Validar cantidad positiva
      if (cartData.quantity <= 0) {
        throw new HttpException('Quantity must be greater than 0', HttpStatus.BAD_REQUEST);
      }

      // Buscar usuario y videojuego en paralelo para mejor performance
      const [user, videogame] = await Promise.all([
        this.userRepository.findOne({ where: { id: userId } }),
        this.videogameRepository.findOne({ 
          where: { id: cartData.videogameId },
          select: ['id', 'price', 'stock'] // Solo traer campos necesarios
        })
      ]);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (!videogame) {
        throw new HttpException('Videogame not found', HttpStatus.NOT_FOUND);
      }

      // Validar stock disponible
      if (videogame.stock < cartData.quantity) {
        throw new HttpException(
          `Not enough stock. Available: ${videogame.stock}`, 
          HttpStatus.BAD_REQUEST
        );
      }

      let cartItem = await this.cartRepository.findOne({
        where: {
          user: { id: userId },
          videogame: { id: cartData.videogameId }
        }
      });

      if (cartItem) {
        const newQuantity = cartItem.quantity + cartData.quantity;
        
        // Validar que la cantidad total no exceda el stock
        if (newQuantity > videogame.stock) {
          throw new HttpException(
            `Cannot add more items. Stock limit: ${videogame.stock}`,
            HttpStatus.BAD_REQUEST
          );
        }

        cartItem.quantity = newQuantity;
        cartItem.updatedAt = new Date();
      } else {
        cartItem = this.cartRepository.create({
          user,
          videogame,
          quantity: cartData.quantity,
          unitPrice: videogame.price // Guardar el precio actual
        });
      }

      return await this.cartRepository.save(cartItem);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error adding item to cart',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}