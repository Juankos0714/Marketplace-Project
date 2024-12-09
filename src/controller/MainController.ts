import { Request, Response } from "express";
import { prisma } from "../database/prisma";

export const renderHomePage = (req: Request, res: Response) => {
  res.render("../views/index"); 
};

export const categories = async (req: Request, res: Response) => {
  try {
    const category = await prisma.product.findMany({
      where: { category: req.params.nombre },
    });
    res.render("product/categories.ejs", { category });
  } catch (err) {
    console.log(err);
    res.render("errors/404.ejs");
  }
};

export const carrito = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.render("product/productCart.ejs", { products });
  } catch (err) {
    console.log(err);
    res.render("errors/404.ejs");
  }
};

export const allCategories = async (req: Request, res: Response) => {
  try {
    res.render("product/allCategories.ejs");
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

      res.render("index", {
        products,
        topSeller,
        newsComments,
        newsAdd,
        offerts,
      });
    } catch (err) {
      console.log(err);
      res.render("errors/404.ejs");
    }
  },
};

export default mainController;