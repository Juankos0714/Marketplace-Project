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
router.get("/get-all-users", authMiddleware(["adm"]), getAllUser); // Ruta para obtener todos los usuarios
router.get("/get-unique-user/:id", authMiddleware(["adm", "Vendedor", "Comprador"]), getUniqueUser); // Ruta para obtener un usuario único
router.delete("/delete-users", authMiddleware(["adm"]), deleteManyUser); // Ruta para eliminar múltiples usuarios

/**
 * Rutas de acceso
 */
router.post("/access", authMiddleware(["adm"]), createAccess);
router.get("/accesses", authMiddleware(["adm", "Vendedor"]), getAllAccesses);

/**
 * Almacenar rutas
 */
router.post("/store", authMiddleware(["adm", "Vendedor"]), createStore);
router.get(
  "/stores",
  authMiddleware(["adm", "Vendedor", "Comprador"]),
  getAllStore
);
router.put(
  "/update-store/:storeId",
  authMiddleware(["adm", "Vendedor"]),
  updateStore
);

/**
 * Rutas de productos
 */
router.post(
  "/product/:storeId",
  authMiddleware(["adm", "Vendedor"]),
  createProduct
);
router.put(
  "/update-product/:productId",
  authMiddleware(["adm", "Vendedor"]),
  updateProduct
);
router.get(
  "/products",
  authMiddleware(["adm", "Vendedor", "Comprador"]),
  getAllProducts
);
router.get(
  "/get-unique-product/:productId",
  authMiddleware(["adm", "Vendedor", "Comprador"]),
  getUniqueProduct
);
router.delete(
  "/delete-product/:productId",
  authMiddleware(["adm", "Vendedor"]),
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
  authMiddleware(["adm", "Vendedor", "Comprador"]),
  createSale
);
router.get("/get-all-sales", authMiddleware(["adm"]), getAllSales);
router.get(
  "/get-all-sales-by-buyer",
  authMiddleware(["adm", "Comprador"]),
  getAllSalesByBuyer
);
router.get(
  "/get-all-sales-by-seller",
  authMiddleware(["adm", "Vendedor"]),
  getAllSalesBySeller
);