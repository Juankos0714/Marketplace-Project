"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const prisma_1 = require("../database/prisma");
const authMiddleware = (roles) => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: "Token no proporcionado" });
            }
            const token = authHeader.split(" ")[1];
            const decoded = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET || 'clave_secreta_para_pruebas');
            const user = await prisma_1.prisma.user.findUnique({
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
            req.user = { ...user, id: user.id.toString() };
            next();
        }
        catch (error) {
            return res.status(401).json({ message: "Token inválido" });
        }
    };
};
exports.authMiddleware = authMiddleware;
