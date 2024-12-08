"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAccesses = exports.createAccess = void 0;
const prisma_1 = require("../database/prisma");
const client_1 = require("@prisma/client");
const createAccess = async (req, res) => {
    try {
        const { name } = req.body;
        const access = await prisma_1.prisma.access.create({
            data: { name },
        });
        return res.status(201).json(access);
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return res.status(400).json({
                    message: "Ya existe un acceso con ese nombre"
                });
            }
        }
        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};
exports.createAccess = createAccess;
const getAllAccesses = async (_req, res) => {
    const accesses = await prisma_1.prisma.access.findMany();
    return res.json(accesses);
};
exports.getAllAccesses = getAllAccesses;
