import { Router } from "express";

import { createAccess, getAllAccesses } from "./controller/AccessController";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getUniqueProduct,
  updateProduct,
} from "./controller/ProductController";
import {
  createSale,
  getAllSales,
  getAllSalesByBuyer,
  getAllSalesBySeller,
} from "./controller/SaleController";
import { signIn } from "./controller/SessionController";
import { createStore, getAllStore, updateStore } from "./controller/StoreController";
import {
  createUser,
  deleteManyUser,
  getAllUser,
  getUniqueUser,
} from "./controller/UserController";
import { authMiddleware } from "./middlewares/AuthMiddleware";

export const router = Router();



/**
 * Rutas de usuario
 */
router.post("/user", createUser); // Ruta para registrar un nuevo usuario
router.post("/sign-in", signIn); // Ruta para iniciar sesión
router.get("/get-all-users", authMiddleware(["admin"]), getAllUser); // Ruta para obtener todos los usuarios
router.get("/get-unique-user/:id", authMiddleware(["admin", "vendedor", "comprador"]), getUniqueUser); // Ruta para obtener un usuario único
router.delete("/delete-users", authMiddleware(["admin"]), deleteManyUser); // Ruta para eliminar múltiples usuarios

/**
 * Rutas de acceso
 */
router.post("/access", authMiddleware(["admin"]), createAccess);
router.get("/accesses", authMiddleware(["admin", "vendedor"]), getAllAccesses);

/**
 * Almacenar rutas
 */
router.post("/store", authMiddleware(["admin", "vendedor"]), createStore);
router.get(
  "/stores",
  authMiddleware(["admin", "vendedor", "comprador"]),
  getAllStore
);
router.put(
  "/update-store/:storeId",
  authMiddleware(["admin", "vendedor"]),
  updateStore
);

/**
 * Rutas de productos
 */
router.post(
  "/product/:storeId",
  authMiddleware(["admin", "vendedor"]),
  createProduct
);
router.put(
  "/update-product/:productId",
  authMiddleware(["admin", "vendedor"]),
  updateProduct
);
router.get(
  "/products",
  authMiddleware(["admin", "vendedor", "comprador"]),
  getAllProducts
);
router.get(
  "/get-unique-product/:productId",
  authMiddleware(["admin", "vendedor", "comprador"]),
  getUniqueProduct
);
router.delete(
  "/delete-product/:productId",
  authMiddleware(["admin", "vendedor"]),
  deleteProduct
);

/**
 * Rutas de autenticación
 */
router.post("/sign-in", signIn);

/**
 * Rutas de venta
 */
router.post(
  "/create-sale",
  authMiddleware(["admin", "vendedor", "comprador"]),
  createSale
);
router.get("/get-all-sales", authMiddleware(["admin"]), getAllSales);
router.get(
  "/get-all-sales-by-buyer",
  authMiddleware(["admin", "comprador"]),
  getAllSalesByBuyer
);
router.get(
  "/get-all-sales-by-seller",
  authMiddleware(["admin", "vendedor"]),
  getAllSalesBySeller
);
/**
 * Rutas del carrito
 */
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from "../src/controller/CartController";
router.get('/cart', authMiddleware, getCart); // Ruta para obtener los productos en el carrito del usuario
router.post('/cart/products/:productId', authMiddleware, addToCart);// Ruta para agregar un producto al carrito
router.put('/cart/items/:itemId', authMiddleware, updateCartItem);// Ruta para actualizar la cantidad de un producto en el carrito
router.delete('/cart/items/:itemId', authMiddleware, removeFromCart);// Ruta para eliminar un producto del carrito
router.delete('/cart', authMiddleware, clearCart);