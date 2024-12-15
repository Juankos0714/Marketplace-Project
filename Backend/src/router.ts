import { Router } from "express";

import { createAccess, getAllAccesses } from "./controller/AccessController";
import {
  // createProduct,
  deleteProduct,
  getAllProducts,
  getUniqueProduct,
  updateProduct,getMostVisitedProducts
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
import { authMiddleware, ensureAuthenticated } from "./middlewares/AuthMiddleware";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from "./controller/CartController";
import { renderHomePage, categories, carrito, allCategories, admin, renderLoginPage, } from "./controller/MainController";



export const router = Router();

// Ruta para la página principal
router.get("/", renderHomePage); // on
// Ruta para el catalogo/categorias
router.get("/catalogo", getAllProducts); // on


router.get("/categories/:nombre", categories);

router.get("/sign-in", renderLoginPage);


router.get("/productCart", authMiddleware(["common_user"]), carrito);

router.get("/admin", authMiddleware(["admin"]), admin);

export default router;

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
  // createProduct
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
  "/product/:id",ensureAuthenticated,
  authMiddleware(["admin", "vendedor", "comprador"]),
  getUniqueProduct
);
router.delete(
  "/delete-product/:productId",
  authMiddleware(["admin", "vendedor"]),
  deleteProduct
);
router.get(
  "/most-visited-products", // Nueva ruta para los productos más visitados
  authMiddleware(["admin", "vendedor", "comprador"]),
  getMostVisitedProducts
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
router.get("/cart", authMiddleware(["comprador"]), getCart); // Ruta para obtener el carrito del usuario
router.post("/cart/:productId", authMiddleware(["comprador"]), addToCart); // Ruta para agregar un producto al carrito
router.put("/cart/:itemId", authMiddleware(["comprador"]), updateCartItem); // Ruta para actualizar un item del carrito
router.delete("/cart/:itemId", authMiddleware(["comprador"]), removeFromCart); // Ruta para eliminar un item del carrito
router.delete("/cart", authMiddleware(["comprador"]), clearCart); // Ruta para limpiar el carrito
