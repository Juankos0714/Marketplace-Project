import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { Prisma } from "@prisma/client";

export const createAccess = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const access = await prisma.access.create({
      data: { name },
    });

    return res.status(201).json(access);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(400).json({ 
          message: "Ya existe un acceso con ese nombre" 
        });
      }
    }
    return res.status(500).json({ 
      message: "Error interno del servidor" 
    });
  }
};

export const getAllAccesses = async (_req: Request, res: Response) => {

  const accesses = await prisma.access.findMany()

  return res.json(accesses);
};
