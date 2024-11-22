"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../config/database");
const cart_entity_1 = require("../entities/cart.entity");
const user_entity_1 = require("../entities/user.entity");
const videogame_entity_1 = require("../entities/videogame.entity");
class CartService {
    constructor() {
        this.cartRepository = database_1.AppDataSource.getRepository(cart_entity_1.Cart);
        this.userRepository = database_1.AppDataSource.getRepository(user_entity_1.User);
        this.videogameRepository = database_1.AppDataSource.getRepository(videogame_entity_1.Videogame);
    }
    addToCart(userId, cartData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validar cantidad positiva
                if (cartData.quantity <= 0) {
                    throw new common_1.HttpException('Quantity must be greater than 0', common_1.HttpStatus.BAD_REQUEST);
                }
                // Buscar usuario y videojuego en paralelo para mejor performance
                const [user, videogame] = yield Promise.all([
                    this.userRepository.findOne({ where: { id: userId } }),
                    this.videogameRepository.findOne({
                        where: { id: cartData.videogameId },
                        select: ['id', 'price', 'stock'] // Solo traer campos necesarios
                    })
                ]);
                if (!user) {
                    throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
                }
                if (!videogame) {
                    throw new common_1.HttpException('Videogame not found', common_1.HttpStatus.NOT_FOUND);
                }
                // Validar stock disponible
                if (videogame.stock < cartData.quantity) {
                    throw new common_1.HttpException(`Not enough stock. Available: ${videogame.stock}`, common_1.HttpStatus.BAD_REQUEST);
                }
                let cartItem = yield this.cartRepository.findOne({
                    where: {
                        user: { id: userId },
                        videogame: { id: cartData.videogameId }
                    }
                });
                if (cartItem) {
                    const newQuantity = cartItem.quantity + cartData.quantity;
                    // Validar que la cantidad total no exceda el stock
                    if (newQuantity > videogame.stock) {
                        throw new common_1.HttpException(`Cannot add more items. Stock limit: ${videogame.stock}`, common_1.HttpStatus.BAD_REQUEST);
                    }
                    cartItem.quantity = newQuantity;
                    cartItem.updatedAt = new Date();
                }
                else {
                    cartItem = this.cartRepository.create({
                        user,
                        videogame,
                        quantity: cartData.quantity,
                        unitPrice: videogame.price // Guardar el precio actual
                    });
                }
                return yield this.cartRepository.save(cartItem);
            }
            catch (error) {
                if (error instanceof common_1.HttpException)
                    throw error;
                throw new common_1.HttpException('Error adding item to cart', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
}
exports.CartService = CartService;
//# sourceMappingURL=cart.service.js.map