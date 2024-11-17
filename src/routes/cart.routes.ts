import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { AddToCartDto, UpdateCartDto } from '../dto/cart.dto';

const router = Router();
const cartController = new CartController();

router.post('/', 
  [authMiddleware, validationMiddleware(AddToCartDto)],
  cartController.addToCart.bind(cartController)
);

router.delete('/:id',
  [authMiddleware],
  cartController.removeFromCart.bind(cartController)
);

router.put('/:id',
  [authMiddleware, validationMiddleware(UpdateCartDto)],
  cartController.updateCartItem.bind(cartController)
);

router.get('/',
  [authMiddleware],
  cartController.getCart.bind(cartController)
);

export default router;