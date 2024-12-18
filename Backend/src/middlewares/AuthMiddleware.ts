import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { prisma } from "../database/prisma";

export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.redirect('/sign-in');
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verify(token, process.env.JWT_SECRET || 'clave_secreta_para_pruebas') as any;
    req.user = { id: decoded.userId };
    return next();
  } catch {
    return res.redirect('/sign-in');
  }
};


export const authMiddleware = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ message: "Token no proporcionado" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = verify(token, process.env.JWT_SECRET || 'clave_secreta_para_pruebas') as any;

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { Access: true }
      });

      if (!user) {
        return res.status(401).json({ message: "Usuario no encontrado" });
      }

      const userRole = user.Access?.name;
      const hasRole = roles.includes(userRole);

      if (!hasRole) {
        return res.status(403).json({ message: "Permiso denegado" });
      }

      req.user = { id: user.id.toString() };
      next();
    } catch (error) {
      return res.status(401).json({ message: "Token inválido" });
    }
  };
};
