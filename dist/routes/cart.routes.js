"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("../controllers/cart.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const cart_dto_1 = require("../dto/cart.dto");
const router = (0, express_1.Router)();
const cartController = new cart_controller_1.CartController();
router.post('/', [auth_middleware_1.authMiddleware, (0, validation_middleware_1.validationMiddleware)(cart_dto_1.AddToCartDto)], cartController.addToCart.bind(cartController));
router.delete('/:id', [auth_middleware_1.authMiddleware], cartController.removeFromCart.bind(cartController));
router.put('/:id', [auth_middleware_1.authMiddleware, (0, validation_middleware_1.validationMiddleware)(cart_dto_1.UpdateCartDto)], cartController.updateCartItem.bind(cartController));
router.get('/', [auth_middleware_1.authMiddleware], cartController.getCart.bind(cartController));
exports.default = router;
//# sourceMappingURL=cart.routes.js.map