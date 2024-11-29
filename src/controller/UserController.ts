import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { hash } from "bcryptjs";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, accessId } = req.body;

    const hashedPassword = await hash(password, 8);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        Access: {
          connect: {
            id: accessId
          }
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        Access: {
          select: {
            name: true
          }
        },
        created_at: true
      }
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        Access: {
          select: {
            name: true
          }
        },
        created_at: true
      }
    });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getUniqueUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        Access: {
          select: {
            name: true
          }
        },
        created_at: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json(error);
  }
};