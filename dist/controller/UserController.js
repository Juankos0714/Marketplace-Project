"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteManyUser = exports.getUniqueUser = exports.getAllUser = exports.createUser = void 0;
const prisma_1 = require("../database/prisma");
const bcryptjs_1 = require("bcryptjs");
const createUser = async (req, res) => {
    try {
        const { name, email, password, accessId } = req.body;
        // Verificar si el correo electrónico ya existe
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ message: "El correo electrónico ya está en uso" });
        }
        // Encriptar la contraseña
        const hashedPassword = await (0, bcryptjs_1.hash)(password, 10);
        const user = await prisma_1.prisma.user.create({
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
    }
    catch (error) {
        return res.status(400).json(error);
    }
};
exports.createUser = createUser;
const getAllUser = async (req, res) => {
    try {
        const users = await prisma_1.prisma.user.findMany({
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
    }
    catch (error) {
        return res.status(400).json(error);
    }
};
exports.getAllUser = getAllUser;
const getUniqueUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = Number(id);
        const user = await prisma_1.prisma.user.findUnique({
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
    }
    catch (error) {
        return res.status(400).json(error);
    }
};
exports.getUniqueUser = getUniqueUser;
const deleteManyUser = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) {
            return res.status(400).json({ message: "Se requiere un array de IDs" });
        }
        const deletedUsers = await prisma_1.prisma.user.deleteMany({
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
    }
    catch (error) {
        console.error("Error al eliminar usuarios:", error);
        return res.status(500).json({
            message: "Error al eliminar usuarios",
            error
        });
    }
};
exports.deleteManyUser = deleteManyUser;
