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
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const videogame = await this.videogameRepository.findOne({ where: { id: cartData.videogameId } });
    if (!videogame) throw new Error('Videogame not found');

    let cartItem = await this.cartRepository.findOne({
      where: {
        user: { id: userId },
        videogame: { id: cartData.videogameId }
      }
    });

    if (cartItem) {
      cartItem.quantity += cartData.quantity;
      return await this.cartRepository.save(cartItem);
    }

    cartItem = this.cartRepository.create({
      user,
      videogame,
      quantity: cartData.quantity
    });

    return await this.cartRepository.save(cartItem);