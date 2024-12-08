"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const AccessController_1 = require("./controller/AccessController");
const ProductController_1 = require("./controller/ProductController");
const SaleController_1 = require("./controller/SaleController");
const SessionController_1 = require("./controller/SessionController");
const StoreController_1 = require("./controller/StoreController");
const UserController_1 = require("./controller/UserController");
const AuthMiddleware_1 = require("./middlewares/AuthMiddleware");
exports.router = (0, express_1.Router)();
/**
 * Rutas de usuario
 */
exports.router.post("/user", UserController_1.createUser); // Ruta para registrar un nuevo usuario
exports.router.post("/sign-in", SessionController_1.signIn); // Ruta para iniciar sesión
exports.router.get("/get-all-users", (0, AuthMiddleware_1.authMiddleware)(["admin"]), UserController_1.getAllUser); // Ruta para obtener todos los usuarios
exports.router.get("/get-unique-user/:id", (0, AuthMiddleware_1.authMiddleware)(["admin", "vendedor", "comprador"]), UserController_1.getUniqueUser); // Ruta para obtener un usuario único
exports.router.delete("/delete-users", (0, AuthMiddleware_1.authMiddleware)(["admin"]), UserController_1.deleteManyUser); // Ruta para eliminar múltiples usuarios
/**
 * Rutas de acceso
 */
exports.router.post("/access", (0, AuthMiddleware_1.authMiddleware)(["admin"]), AccessController_1.createAccess);
exports.router.get("/accesses", (0, AuthMiddleware_1.authMiddleware)(["admin", "vendedor"]), AccessController_1.getAllAccesses);
/**
 * Almacenar rutas
 */
exports.router.post("/store", (0, AuthMiddleware_1.authMiddleware)(["admin", "vendedor"]), StoreController_1.createStore);
exports.router.get("/stores", (0, AuthMiddleware_1.authMiddleware)(["admin", "vendedor", "comprador"]), StoreController_1.getAllStore);
exports.router.put("/update-store/:storeId", (0, AuthMiddleware_1.authMiddleware)(["admin", "vendedor"]), StoreController_1.updateStore);
/**
 * Rutas de productos
 */
exports.router.post("/product/:storeId", (0, AuthMiddleware_1.authMiddleware)(["admin", "vendedor"]), ProductController_1.createProduct);
exports.router.put("/update-product/:productId", (0, AuthMiddleware_1.authMiddleware)(["admin", "vendedor"]), ProductController_1.updateProduct);
exports.router.get("/products", (0, AuthMiddleware_1.authMiddleware)(["admin", "vendedor", "comprador"]), ProductController_1.getAllProducts);
exports.router.get("/get-unique-product/:productId", (0, AuthMiddleware_1.authMiddleware)(["admin", "vendedor", "comprador"]), ProductController_1.getUniqueProduct);
exports.router.delete("/delete-product/:productId", (0, AuthMiddleware_1.authMiddleware)(["admin", "vendedor"]), ProductController_1.deleteProduct);
/**
 * Rutas de autenticación
 */
exports.router.post("/sign-in", SessionController_1.signIn);
/**
 * Rutas de venta
 */
exports.router.post("/create-sale", (0, AuthMiddleware_1.authMiddleware)(["admin", "vendedor", "comprador"]), SaleController_1.createSale);
exports.router.get("/get-all-sales", (0, AuthMiddleware_1.authMiddleware)(["admin"]), SaleController_1.getAllSales);
exports.router.get("/get-all-sales-by-buyer", (0, AuthMiddleware_1.authMiddleware)(["admin", "comprador"]), SaleController_1.getAllSalesByBuyer);
exports.router.get("/get-all-sales-by-seller", (0, AuthMiddleware_1.authMiddleware)(["admin", "vendedor"]), SaleController_1.getAllSalesBySeller);
/**
 * Rutas del carrito
 */
const CartController_1 = require("../src/controller/CartController");
exports.router.get('/cart', AuthMiddleware_1.authMiddleware, CartController_1.getCart); // Ruta para obtener los productos en el carrito del usuario
exports.router.post('/cart/products/:productId', AuthMiddleware_1.authMiddleware, CartController_1.addToCart); // Ruta para agregar un producto al carrito
exports.router.put('/cart/items/:itemId', AuthMiddleware_1.authMiddleware, CartController_1.updateCartItem); // Ruta para actualizar la cantidad de un producto en el carrito
exports.router.delete('/cart/items/:itemId', AuthMiddleware_1.authMiddleware, CartController_1.removeFromCart); // Ruta para eliminar un producto del carrito
exports.router.delete('/cart', AuthMiddleware_1.authMiddleware, CartController_1.clearCart);
