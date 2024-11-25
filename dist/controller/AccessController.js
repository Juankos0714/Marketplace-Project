"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAccesses = exports.createAccess = void 0;
const prisma_1 = require("../database/prisma");
const createAccess = async (req, res) => {
    const { name } = req.body;
    const access = await prisma_1.prisma.access.create({
        data: { name },
    });
    return res.json(access);
};
exports.createAccess = createAccess;
const getAllAccesses = async (req, res) => {
    const accesses = await prisma_1.prisma.access.findMany();
    return res.json(accesses);
};
exports.getAllAccesses = getAllAccesses;
