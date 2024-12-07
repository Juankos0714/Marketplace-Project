import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { Prisma } from "@prisma/client";

export const mainController = {
    index:  async (_req : Request, res: Response) => { 
        try {
            // const products = await prisma.product.findMany();
            res.render("index");
        }
        catch (error) {
            res.status(500).send("Error al obtener los productos");
        }
    }
}