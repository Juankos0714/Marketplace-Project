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
const CartController_1 = require("./controller/CartController");
const MainController_1 = require("./controller/MainController");
exports.router = (0, express_1.Router)();
// Ruta para la página principal
exports.router.get("/", MainController_1.renderHomePage);
exports.router.get("/categories/:nombre", MainController_1.categories);
exports.router.get("/productCart", (0, AuthMiddleware_1.authMiddleware)(["common_user"]), MainController_1.carrito);
exports.router.get("/allCategories", MainController_1.allCategories);
exports.router.get("/admin", (0, AuthMiddleware_1.authMiddleware)(["admin"]), MainController_1.admin);
exports.default = exports.router;
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
exports.router.get("/product/:id", (0, AuthMiddleware_1.authMiddleware)(["admin", "vendedor", "comprador"]), ProductController_1.getUniqueProduct);
exports.router.delete("/delete-product/:productId", (0, AuthMiddleware_1.authMiddleware)(["admin", "vendedor"]), ProductController_1.deleteProduct);
exports.router.get("/most-visited-products", // Nueva ruta para los productos más visitados
(0, AuthMiddleware_1.authMiddleware)(["admin", "vendedor", "comprador"]), ProductController_1.getMostVisitedProducts);
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
exports.router.get("/cart", (0, AuthMiddleware_1.authMiddleware)(["comprador"]), CartController_1.getCart); // Ruta para obtener el carrito del usuario
exports.router.post("/cart/:productId", (0, AuthMiddleware_1.authMiddleware)(["comprador"]), CartController_1.addToCart); // Ruta para agregar un producto al carrito
exports.router.put("/cart/:itemId", (0, AuthMiddleware_1.authMiddleware)(["comprador"]), CartController_1.updateCartItem); // Ruta para actualizar un item del carrito
exports.router.delete("/cart/:itemId", (0, AuthMiddleware_1.authMiddleware)(["comprador"]), CartController_1.removeFromCart); // Ruta para eliminar un item del carrito
exports.router.delete("/cart", (0, AuthMiddleware_1.authMiddleware)(["comprador"]), CartController_1.clearCart); // Ruta para limpiar el carrito
console.log("router.ts - router", exports.router);
