import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }, 
      include: { Access: true },
    });

    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado." });
    }

    const validPassword = await compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Contraseña incorrecta." });
    }

    const token = sign(
      {
        userId: user.id,
        email: user.email,
        role: user.Access?.name,
      },
      process.env.JWT_SECRET || 'clave_secreta_para_pruebas',
      { expiresIn: '24h' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.Access?.name,
      },
    });

  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};