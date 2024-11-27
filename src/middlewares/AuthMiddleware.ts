import { Request, Response, NextFunction } from "express";
import { prisma } from "../database/prisma";
import jwt from "jsonwebtoken";

export const authMiddleware = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Token no proporcionado" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        include: { Access: true } // Asegúrate de incluir Access
      });

      if (!user) {
        return res.status(401).json({ message: "Usuario no encontrado" });
      }

      const userRoles = user.Access ? [user.Access.name] : [];
      const hasRole = roles.some(role => userRoles.includes(role));

      if (!hasRole) {
        return res.status(403).json({ message: "Permiso denegado" });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Token inválido" });
    }
  };
};