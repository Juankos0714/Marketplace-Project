import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extiende la interfaz Request de Express para incluir la propiedad user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Middleware de autenticación JWT
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Intenta extraer y verificar el token JWT
  try {
    // Obtiene el token del encabezado de autorización
    const token = req.headers.authorization?.split(' ')[1];

    // Si no hay token, devuelve un error 401 (No autorizado)
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verifica y decodifica el token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    // Asigna el token decodificado a la propiedad user de la solicitud
    req.user = decoded;

    // Llama a la siguiente función de middleware
    next();
  } catch (error) {
    // Si el token es inválido o ha expirado, devuelve un error 401 (No autorizado)
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
