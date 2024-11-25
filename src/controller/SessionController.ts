import { compare } from "bcryptjs";
import { Request, Response } from "express";
import { sign } from 'jsonwebtoken';
import { prisma } from "../database/prisma";

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        userAccess: {
          select: {
            Access: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado." });
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Contraseña incorrecta." });
    }

    const MY_SECRET_KEY = process.env.MY_SECRET_KEY;

    if (!MY_SECRET_KEY) {
      throw new Error("Clave secreta no proporcionada");
    }

    const token = sign({
      userId: user.id, roles: user.userAccess.map(role => role.Access?.name)
    }, MY_SECRET_KEY, {
      algorithm: "HS256",
      expiresIn: "1h"
    })

    return res.status(200).json({token})

  } catch (error) {
    return res.status(400).json(error);
  }
};
