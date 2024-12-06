"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = void 0;
const prisma_1 = require("../database/prisma");
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma_1.prisma.user.findUnique({
            where: { email },
            include: { Access: true },
        });
        if (!user) {
            return res.status(400).json({ message: "Usuario no encontrado." });
        }
        const validPassword = await (0, bcryptjs_1.compare)(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Contraseña incorrecta." });
        }
        const token = (0, jsonwebtoken_1.sign)({
            userId: user.id,
            email: user.email,
            role: user.Access?.name,
        }, process.env.JWT_SECRET || 'clave_secreta_para_pruebas', { expiresIn: '24h' });
        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.Access?.name,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
    }
};
exports.signIn = signIn;
