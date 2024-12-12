import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { upload } from '../middlewares/UploadMiddleware';
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  upload.single('image')(req, res, async (err: any) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    try {
      const { name, description, category, platform, price, amount } = req.body;
      const storeId = parseInt(req.params.storeId, 10);
      if (!name || !description || !category || !platform || !price || !amount) {
        return res.status(400).json({ error: "Todos los campos son requeridos" });
      }
      const imageUrl = req.file ? req.file.path : '';
      const product = await prisma.product.create({
        data: {
          name,
          description,
          image: imageUrl,
          category,
          platform,
          price: parseFloat(price),
          amount: parseInt(amount, 10),
          storeId,
        },
      });
      return res.status(201).json(product);
    } catch (error) {
      console.error("Error al crear producto:", error);
      return res.status(500).json({ error: "Error al crear el producto" });
    }
  });
};

export const updateProduct = async (req: Request, res: Response) => {
  uploadSingle(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { name, description, category, platform, price, amount } = req.body;
      const productId = parseInt(req.params.productId, 10);
      const userId = parseInt(req.user.id, 10);

      const isProduct = await prisma.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          Store: true,
        },
      });

      if (!isProduct) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      if (userId !== isProduct?.Store?.userId) {
        return res.status(403).json({ message: "Este producto no pertenece a este usuario" });
      }

      const imageUrl = req.file ? `${req.file.filename}` : isProduct.image;

      const product = await prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          name,
          description,
          image: imageUrl,
          category,
          platform,
          price: parseFloat(price),
          amount: parseInt(amount, 10),
        },
      });

      return res.status(200).json(product);
    } catch (error) {
      return res.status(400).json(error);
    }
  });
};

export const getAllProducts = async (req: Request, res: Response) => {
  // const page = parseInt(req.query.page as string, 10) || 1;
  // const perPage = parseInt(req.query.perPage as string, 10) || 10;

  try {
    // Obtener todos los productos
    const products = await prisma.product.findMany({
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
    });

    // Renderizar la vista y pasar los productos
    res.render("catalogo", { products });
  } catch (err) {
    console.error("Error obteniendo productos:", err);
    res.status(500).render("errors/404.ejs"); // Renderizar página de error
  }
};


export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.productId, 10); 
    const userId = parseInt(req.user.id, 10);

    const isProduct = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        Store: true,
      },
    });

    if (!isProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    if (userId !== isProduct?.Store?.userId) {
      return res.status(403).json({ message: "Este producto no pertenece a este usuario" });
    }

    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return res.status(204).json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    return res.status(400).json(error);
  }
};
export const getMostVisitedProducts = async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string, 10) || 10; // Número de productos a mostrar

  try {
    const products = await prisma.product.findMany({
      orderBy: {
        views: 'desc', // Ordenar por la cantidad de visitas en orden descendente
      },
      take: limit, // Limitar el número de resultados
    });

    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener los productos más visitados" });
  }
};

// Actualizar la función para incrementar la cantidad de visitas
export const getUniqueProduct = async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        category: true,
        platform: true,
        price: true,
        amount: true,
        views: true, 
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }


    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        views: product.views + 1,
      },
    });

    return res.status(200).json(product);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  const category = req.params.category;

  try {
    const products = await prisma.product.findMany({
      where: {
        category,
      },
    });

    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener los productos por categoría" });
  }
};

function uploadSingle(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: (err: any) => Promise<Response<any, Record<string, any>>>) {
  upload.single('image')(req, res, (err: any) => {
    if (err) {
      return next(err);
    }
    next(null);
  });
}