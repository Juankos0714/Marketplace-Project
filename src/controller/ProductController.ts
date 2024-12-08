import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
import { upload } from "../config/multer"
import { uploadSingle, uploadMultiple } from '../middlewares/uploadMiddleware';

const router = Router();

export const createProduct = async (req: Request, res: Response) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { name, description, category, platform, price, amount } = req.body;
      const storeId = parseInt(req.params.storeId, 10);

      if (!name || !description || !category || !platform || !price || !amount) {
        return res.status(400).json({ error: "Todos los campos son requeridos" });
      }

      const image = req.file ? req.file.path : '';

      const product = await prisma.product.create({
        data: {
          name,
          description,
          image,
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
  upload.single('image')(req, res, async (err) => {
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

      const image = req.file ? req.file.path : isProduct.image;

      const product = await prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          name,
          description,
          image,
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
  const page = parseInt(req.query.page as string, 10) || 1;
  const perPage = parseInt(req.query.perPage as string, 10) || 10;

  const products = await prisma.product.findMany({
    skip: (page - 1) * perPage,
    take: perPage,
  });

  return res.json(products);
};

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
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(400).json(error);
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
// For single image upload
router.post('/upload-single', uploadSingle, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  // Access the file info
  const imageUrl = `/images/${req.file.filename}`;
  
  // Save to database or process further
  // ...

  res.json({ imageUrl });
});

// For multiple images
router.post('/upload-multiple', uploadMultiple, async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }
  
  const files = req.files as Express.Multer.File[];
  const imageUrls = files.map(file => `/images/${file.filename}`);
  
  // Save to database or process further
  // ...

  res.json({ imageUrls });
});
router.post('/product/:storeId', uploadSingle, createProduct);
router.put('/update-product/:productId', uploadSingle, updateProduct);

export default router;