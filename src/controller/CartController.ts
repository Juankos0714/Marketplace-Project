import { Request, Response } from "express";
import { prisma } from "../database/prisma";

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.user.id, 10);

    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
                amount: true // stock disponible
              }
            }
          }
        }
      }
    });

    if (!cart) {
      // Si no existe un carrito, crear uno nuevo
      const newCart = await prisma.cart.create({
        data: { userId },
        include: { items: true }
      });
      return res.json(newCart);
    }

    return res.json(cart);
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    return res.status(500).json({ error: "Error al obtener el carrito" });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.user.id, 10);
    const productId = parseInt(req.params.productId, 10);
    const { quantity = 1 } = req.body;

    // Verificar si el producto existe y tiene stock suficiente
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    if (product.amount < quantity) {
      return res.status(400).json({ error: "Stock insuficiente" });
    }

    // Obtener o crear el carrito
    let cart = await prisma.cart.findFirst({
      where: { userId }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId }
      });
    }

    // Verificar si el producto ya está en el carrito
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId
      }
    });

    if (existingItem) {
      // Actualizar cantidad
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true }
      });
      return res.json(updatedItem);
    }

    // Agregar nuevo item al carrito
    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity
      },
      include: { product: true }
    });

    return res.status(201).json(cartItem);
  } catch (error) {
    console.error("Error al agregar al carrito:", error);
    return res.status(500).json({ error: "Error al agregar al carrito" });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.user.id, 10);
    const itemId = parseInt(req.params.itemId, 10);
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
    }

    // Verificar que el item pertenece al carrito del usuario
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: { userId }
      },
      include: { product: true }
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Item no encontrado en el carrito" });
    }

    if (cartItem.product.amount < quantity) {
      return res.status(400).json({ error: "Stock insuficiente" });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { product: true }
    });

    return res.json(updatedItem);
  } catch (error) {
    console.error("Error al actualizar item del carrito:", error);
    return res.status(500).json({ error: "Error al actualizar item del carrito" });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.user.id, 10);
    const itemId = parseInt(req.params.itemId, 10);

    // Verificar que el item pertenece al carrito del usuario
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: { userId }
      }
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Item no encontrado en el carrito" });
    }

    await prisma.cartItem.delete({
      where: { id: itemId }
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar del carrito:", error);
    return res.status(500).json({ error: "Error al eliminar del carrito" });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.user.id, 10);

    // Obtener el carrito del usuario
    const cart = await prisma.cart.findFirst({
      where: { userId }
    });

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    // Eliminar todos los items del carrito
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Error al limpiar el carrito:", error);
    return res.status(500).json({ error: "Error al limpiar el carrito" });
  }
};