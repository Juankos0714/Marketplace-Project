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
 * Rotas do usuário
 */
exports.router.post("/user", UserController_1.createUser);
exports.router.delete("/delete-users", (0, AuthMiddleware_1.authMiddleware)(["adm"]), UserController_1.deleteManyUser);
exports.router.get("/get-all-users", (0, AuthMiddleware_1.authMiddleware)(["adm"]), UserController_1.getAllUser);
exports.router.get("/get-unique-user", (0, AuthMiddleware_1.authMiddleware)(["adm", "Vendedor", "Comprador"]), UserController_1.getUniqueUser);
/**
 * Rotas de acessos
 */
exports.router.post("/access", (0, AuthMiddleware_1.authMiddleware)(["adm"]), AccessController_1.createAccess);
exports.router.get("/accesses", (0, AuthMiddleware_1.authMiddleware)(["adm", "Vendedor"]), AccessController_1.getAllAccesses);
/**
 * Rotas da loja
 */
exports.router.post("/store", (0, AuthMiddleware_1.authMiddleware)(["adm", "Vendedor"]), StoreController_1.createStore);
exports.router.get("/stores", (0, AuthMiddleware_1.authMiddleware)(["adm", "Vendedor", "Comprador"]), StoreController_1.getAllStore);
exports.router.put("/update-store/:storeId", (0, AuthMiddleware_1.authMiddleware)(["adm", "Vendedor"]), StoreController_1.updateStore);
/**
 * Rotas do produto
 */
exports.router.post("/product/:storeId", (0, AuthMiddleware_1.authMiddleware)(["adm", "Vendedor"]), ProductController_1.createProduct);
exports.router.get("/products", (0, AuthMiddleware_1.authMiddleware)(["adm", "Vendedor", "Comprador"]), ProductController_1.getAllProducts);
exports.router.put("/update-product/:productId", (0, AuthMiddleware_1.authMiddleware)(["adm", "Vendedor"]), ProductController_1.updateProduct);
exports.router.get("/get-unique-product/:productId", (0, AuthMiddleware_1.authMiddleware)(["adm", "Vendedor", "Comprador"]), ProductController_1.getUniqueProduct);
exports.router.delete("/delete-product/:productId", (0, AuthMiddleware_1.authMiddleware)(["adm", "Vendedor"]), ProductController_1.deleteProduct);
/**
 * Rotas de autenticação
 */
exports.router.post("/sign-in", SessionController_1.signIn);
/**
 * Rotas da venda
 */
exports.router.post("/create-sale", (0, AuthMiddleware_1.authMiddleware)(["adm", "Vendedor", "Comprador"]), SaleController_1.createSale);
exports.router.get("/get-all-sales", (0, AuthMiddleware_1.authMiddleware)(["adm"]), SaleController_1.getAllSales);
exports.router.get("/get-all-sales-by-buyer", (0, AuthMiddleware_1.authMiddleware)(["adm", "Comprador"]), SaleController_1.getAllSalesByBuyer);
exports.router.get("/get-all-sales-by-seller", (0, AuthMiddleware_1.authMiddleware)(["adm", "Vendedor"]), SaleController_1.getAllSalesBySeller);
(0, AuthMiddleware_1.authMiddleware)(["adm", "Vendedor"]),
    SaleController_1.getAllSalesBySeller;
;
