import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { hash } from "bcryptjs";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, accessId } = req.body;

    if (!name || !email || !password || !accessId) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe." });
    }

    // Verificar si el accessId existe
    const access = await prisma.access.findUnique({ where: { id: accessId } });
    if (!access) {
      return res.status(400).json({ message: "El accessId proporcionado no existe." });
    }

    // Encriptar la contraseña
    const hashedPassword = await hash(password, 10);

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
    console.error("Error en el servidor:", error);
    return res.status(500).json({ message: "Error en el servidor", error: (error as Error).message });
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
    const userId = Number(id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
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

export const deleteManyUser = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids)) {
      return res.status(400).json({ message: "Se requiere un array de IDs" });
    }

    const deletedUsers = await prisma.user.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    });

    return res.status(200).json({ 
      message: `${deletedUsers.count} usuarios eliminados correctamente`,
      count: deletedUsers.count 
    });
  } catch (error) {
    console.error("Error al eliminar usuarios:", error);
    return res.status(500).json({ 
      message: "Error al eliminar usuarios",
      error 
    });
  }
};