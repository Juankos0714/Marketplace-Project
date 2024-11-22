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
exports.CartController = void 0;
const cart_service_1 = require("../services/cart.service");
class CartController {
    constructor() {
        this.cartService = new cart_service_1.CartService();
    }
    addToCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cartData = req.body;
                const result = yield this.cartService.addToCart(req.user.id, cartData);
                res.status(201).json(result);
            }
            catch (error) {
                const message = error instanceof Error ? error.message : 'Error adding to cart';
                res.status(400).json({ message });
            }
        });
    }
    removeFromCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield this.cartService.removeFromCart(req.user.id, parseInt(id));
                res.status(204).send();
            }
            catch (error) {
                const message = error instanceof Error ? error.message : 'Error removing from cart';
                res.status(400).json({ message });
            }
        });
    }
    updateCartItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const updateData = req.body;
                const result = yield this.cartService.updateCartItem(req.user.id, parseInt(id), updateData);
                res.json(result);
            }
            catch (error) {
                const message = error instanceof Error ? error.message : 'Error updating cart item';
                res.status(400).json({ message });
            }
        });
    }
    getCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cart = yield this.cartService.getUserCart(req.user.id);
                res.json(cart);
            }
            catch (error) {
                const message = error instanceof Error ? error.message : 'Error fetching cart';
                res.status(400).json({ message });
            }
        });
    }
}
exports.CartController = CartController;
//# sourceMappingURL=cart.controller.js.map