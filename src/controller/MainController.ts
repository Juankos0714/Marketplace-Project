import { Request, Response } from "express";
import { prisma } from "../database/prisma";

export const renderHomePage = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.render("index", { products });
  } catch (err) {
    console.error("Error obteniendo productos:", err);
    res.status(500).render("errors/404.ejs");
  }
};

export const renderLoginPage = (req: Request, res: Response) => {
  res.render("login");
};  

export const categories = async (req: Request, res: Response) => {
  try {
    const category = await prisma.product.findMany({
      where: { category: req.params.nombre },
    });
    res.render("catalogo", { category });
  } catch (err) {
    console.log(err);
    res.render("errors/404.ejs");
  }
};

export const carrito = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.render("viwes/productCart.ejs", { products });
  } catch (err) {
    console.log(err);
    res.render("errors/404.ejs");
  }
};

export const allCategories = async (req: Request, res: Response) => {
  try {
    res.render("");
  } catch (err) {
    res.render("errors/404.ejs");
  }
};

export const admin = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    const products = await prisma.product.findMany();
    res.render("admin.ejs", { users, products });
  } catch (err) {
    console.log(err);
    res.render("errors/404.ejs");
  }
};

const mainController = {
  index: async (req: Request, res: Response) => {
    try {
      const products = await prisma.product.findMany();
      const topSeller = await prisma.product.findMany({
        where: { price: { gt: 120 } },
        take: 10,
      });
      const newsComments = await prisma.product.findMany({
        where: { price: { gt: 80 } },
        take: 3,
      });
      const newsAdd = await prisma.product.findMany({
        orderBy: { id: "desc" },
        take: 3,
      });
      const offerts = await prisma.product.findMany({
        where: { price: { lt: 100 } },
      });

      res.render("index", { products });
    } catch (err) {
      console.log(err);
      res.render("errors/404.ejs");
    }
  },
};

export default mainController;