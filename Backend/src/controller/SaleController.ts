import { Request, Response } from "express";
import { prisma } from "../database/prisma";
// Funcion para crear una venta, osea comprar productos
export const createSale = async (req: Request, res: Response) => {
  try {
    const { products, userSellerId } = req.body;
    const id = parseInt(req.user.id, 10);

    // el findMany se utiliza para buscar todos los productos
    // que se encuentran en la base de datos 
    const productsByDatabase = await prisma.product.findMany({
      where: {
        id: { in: products.map((product: any) => product.id) },
      },
    });

    const productWithQuantity = productsByDatabase.map((product) => {
      const { id, name, price } = product;
      const quantity = products.find((p: any) => p.id === product.id).quantity;
      return {
        id,
        name,
        price,
        quantity,
      };
    });

    let total = 0;
    for (const product of productWithQuantity) {
      total += product.price * parseInt(product.quantity);
    }

    if (id === userSellerId) {
      return res.status(400).json({
        message:
          "No es posible crear una venta con el mismo ID de comprador y vendedor.",
      });
    }

    const sale = await prisma.sale.create({
      data: {
        total_value: total,
        Seller: { connect: { id: userSellerId } },
        Buyer: { connect: { id } },
        SaleProduct: {
          create: productWithQuantity.map((product) => ({
            Product: { connect: { id: product.id } },
            quantity: product.quantity,
          })),
        },
      },
      include: {
        SaleProduct: true,
      },
    });

    productWithQuantity.map(async (product) => {
      await prisma.product.updateMany({
        where: { id: product.id },
        data: {
          amount: {
            decrement: parseInt(product.quantity),
          },
        },
      });
    });

    return res
      .status(201)
      .json({ sale, message: "Compra realizada con éxito." });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getAllSales = async (req: Request, res: Response) => {
  const sales = await prisma.sale.findMany({
    select: {
      id: true,
      total_value: true,
      Seller: {
        select: {
          id: true,
          name: true,
        },
      },
      Buyer: {
        select: {
          id: true,
          name: true,
        },
      },
      SaleProduct: {
        select: {
          Product: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
          quantity: true,
        },
      },
      created_at: true,
    },
  });

  return res.status(200).json(sales);
};

export const getAllSalesByBuyer = async (req: Request, res: Response) => {
  const id = parseInt(req.user.id, 10);
  const sales = await prisma.sale.findMany({
    where: {
      buyerId: id,
    },
    select: {
      id: true,
      total_value: true,
      Seller: {
        select: {
          id: true,
          name: true,
        },
      },
      Buyer: {
        select: {
          id: true,
          name: true,
        },
      },
      SaleProduct: {
        select: {
          Product: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
          quantity: true,
        },
      },
      created_at: true,
    },
  });

  return res.status(200).json(sales);
};

export const getAllSalesBySeller = async (req: Request, res: Response) => {
  const id = parseInt(req.user.id, 10);
  const sales = await prisma.sale.findMany({
    where: {
      sellerId: id,
    },
    select: {
      id: true,
      total_value: true,
      Seller: {
        select: {
          id: true,
          name: true,
        },
      },
      Buyer: {
        select: {
          id: true,
          name: true,
        },
      },
      SaleProduct: {
        select: {
          Product: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
          quantity: true,
        },
      },
      created_at: true,
    },
  });

  return res.status(200).json(sales);
};
