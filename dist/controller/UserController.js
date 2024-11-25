"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUniqueUser = exports.getAllUser = exports.deleteManyUser = exports.createUser = void 0;
const bcryptjs_1 = require("bcryptjs");
const prisma_1 = require("../database/prisma");
const createUser = async (req, res) => {
    try {
        const { name, email, password, accessName } = req.body;
        const isUserUniqueEmail = await prisma_1.prisma.user.findUnique({
            where: {
                email,
            },
        });
        const isAccessName = await prisma_1.prisma.access.findUnique({
            where: {
                name: accessName,
            },
        });
        if (!isAccessName) {
            return res
                .status(400)
                .json({ message: "Esté nivel de acesso não existe" });
        }
        if (isUserUniqueEmail) {
            return res
                .status(400)
                .json({ message: "Já existe um usuário com este email" });
        }
        const hashPassword = await (0, bcryptjs_1.hash)(password, 8);
        const user = await prisma_1.prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword,
                userAccess: {
                    create: {
                        Access: {
                            connect: {
                                name: accessName,
                            },
                        },
                    },
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
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
        return res.status(201).json(user);
    }
    catch (error) {
        return res.status(400).json(error);
    }
};
exports.createUser = createUser;
const deleteManyUser = async (req, res) => {
    try {
        await prisma_1.prisma.user.deleteMany();
        return res.status(200).json({ message: "Usuário deletados" });
    }
    catch (error) {
        return res.status(400).json(error);
    }
};
exports.deleteManyUser = deleteManyUser;
const getAllUser = async (req, res) => {
    try {
        const users = await prisma_1.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
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
        if (!users) {
            return res.status(204);
        }
        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(400).json(error);
    }
};
exports.getAllUser = getAllUser;
const getUniqueUser = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                userAccess: {
                    select: {
                        Access: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                store: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        if (!user) {
            return res.status(204);
        }
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(400).json(error);
    }
};
exports.getUniqueUser = getUniqueUser;
