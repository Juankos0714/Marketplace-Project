import { Request, Response } from "express";
import { prisma } from "../database/prisma";

export const getStoreWithProducts = async (req: Request, res: Response) => {
  try {
    const { storeId } = req.params;

    const store = await prisma.store.findUnique({
      where: { id: Number(storeId) },
      include: { products: true } 
    });

    if (!store) {
      return res.status(404).json({ message: "Tienda no encontrada" });
    }

    return res.json(store);
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const createStore = async (req: Request, res: Response) => {
  const { name } = req.body;
  const { id } = req.user;

  const isUser = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!isUser) {
    return res.status(400).json({ message: "El usuario no existe" });
  }

  const store = await prisma.store.create({
    data: {
      name,
      User: {
        connect: {
          id: Number(id),
        },
      },
    },
  });

  return res.json(store);
};

export const updateStore = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const { id } = req.user;
    const { storeId } = req.params;

    const isStore = await prisma.store.findUnique({
      where: {
        id: Number(storeId),
      },
    });

    if (!isStore) {
      return res.status(404).json({ message: "Tienda no encontrada" });
    }

    if (Number(id) !== isStore.userId) {
      return res.status(400).json({ message: "El usuario no es el propietario de esta Tienda" });
    }

    const store = await prisma.store.update({
      where: { id: Number(storeId) },
      data: {
        name,
      },
    });

    return res.status(200).json(store);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const deleteStore = async (req: Request, res: Response) => {
  try {
    const { id } = req.user;
    const { storeId } = req.params;

    const isStore = await prisma.store.findUnique({
      where: {
        id: Number(storeId),
      },
    });

    if (!isStore) {
      return res.status(404).json({ message: "Tienda no encontrada" });
    }

    if (Number(id) !== isStore.userId) {
      return res.status(400).json({ message: "El usuario no es el propietario de esta Tienda" });
    }

    await prisma.store.delete({
      where: { id: Number(storeId) },
    });

    return res.status(200).json({ message: "Tienda eliminada correctamente." });
  } catch (error) {
    return res.status(400).json(error);
  }
};


export const getAllStore = async (req: Request, res: Response) => {
  const stores = await prisma.store.findMany({
    select: {
      id: true,
      name: true,
      User: {
        select: {
          name: true,
        },
      },
      products: {  
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          category: true,
          platform: true,
          price: true,
          amount: true,
        },
      },
    },
  });

  return res.json(stores);
};

export const getUniqueStore = async (req: Request, res: Response) => {
  try {
    const { storeId } = req.params;

    const store = await prisma.store.findUnique({
      where: {
        id: Number(storeId),
      },
      include: {
        products: true,  
        User: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!store) {
      return res.status(404).json({ message: "Tienda no encontrada" });
    }

    return res.status(200).json(store);
  } catch (error) {
    return res.status(400).json(error);
  }
};