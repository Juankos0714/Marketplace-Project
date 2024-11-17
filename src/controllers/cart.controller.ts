import { Request, Response } from 'express';
import { CartService } from '../services/cart.service';
import { AddToCartDto, UpdateCartDto } from '../dto/cart.dto';

export class CartController {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

  public async addToCart(req: Request, res: Response) {
    try {
      const cartData: AddToCartDto = req.body;
      const result = await this.cartService.addToCart(req.user.id, cartData);
      res.status(201).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error adding to cart';
      res.status(400).json({ message });
    }
  }

  public async removeFromCart(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.cartService.removeFromCart(req.user.id, parseInt(id));
      res.status(204).send();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error removing from cart';
      res.status(400).json({ message });
    }
  }

  public async updateCartItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData: UpdateCartDto = req.body;
      const result = await this.cartService.updateCartItem(req.user.id, parseInt(id), updateData);
      res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error updating cart item';
      res.status(400).json({ message });
    }
  }

  public async getCart(req: Request, res: Response) {
    try {
      const cart = await this.cartService.getUserCart(req.user.id);
      res.json(cart);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error fetching cart';
      res.status(400).json({ message });
    }
  }
}