"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = void 0;
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const prisma_1 = require("../database/prisma");
const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma_1.prisma.user.findUnique({
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
            return res.status(400).json({ message: "Usuário não encontrado." });
        }
        const isPasswordValid = await (0, bcryptjs_1.compare)(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Senha incorreta." });
        }
        const MY_SECRET_KEY = process.env.MY_SECRET_KEY;
        if (!MY_SECRET_KEY) {
            throw new Error("Chave secreta não fonercida");
        }
        const token = (0, jsonwebtoken_1.sign)({
            userId: user.id, roles: user.userAccess.map(role => { var _a; return (_a = role.Access) === null || _a === void 0 ? void 0 : _a.name; })
        }, MY_SECRET_KEY, {
            algorithm: "HS256",
            expiresIn: "1h"
        });
        return res.status(200).json({ token });
    }
    catch (error) {
        return res.status(400).json(error);
    }
};
exports.signIn = signIn;
