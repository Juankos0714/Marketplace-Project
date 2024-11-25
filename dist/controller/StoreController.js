"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUniqueStore = exports.getAllStore = exports.deleteStore = exports.updateStore = exports.createStore = void 0;
const prisma_1 = require("../database/prisma");
const createStore = async (req, res) => {
    const { name } = req.body;
    const { id } = req.user;
    const isUser = await prisma_1.prisma.user.findUnique({
        where: {
            id,
        },
    });
    if (!isUser) {
        return res.status(400).json({ message: "Usuário não existe" });
    }
    const store = await prisma_1.prisma.store.create({
        data: {
            name,
            User: {
                connect: {
                    id,
                },
            },
        },
    });
    return res.json(store);
};
exports.createStore = createStore;
const updateStore = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.user;
        const { storeId } = req.params;
        const isStore = await prisma_1.prisma.store.findUnique({
            where: {
                id: storeId,
            },
        });
        if (!isStore) {
            return res.status(404).json({ message: "Loja não encontrada" });
        }
        if (id !== isStore.userId) {
            return res.status(400).json({ message: "Usuário não e dono desta Loja" });
        }
        const store = await prisma_1.prisma.store.update({
            where: { id: storeId },
            data: {
                name,
            },
        });
        return res.status(200).json(store);
    }
    catch (error) {
        return res.status(400).json(error);
    }
};
exports.updateStore = updateStore;
const deleteStore = async (req, res) => {
    try {
        const { id } = req.user;
        const { storeId } = req.params;
        const isStore = await prisma_1.prisma.store.findUnique({
            where: {
                id: storeId,
            },
        });
        if (!isStore) {
            return res.status(404).json({ message: "Loja não encontrada" });
        }
        if (id !== isStore.userId) {
            return res.status(400).json({ message: "Usuário não e dono desta Loja" });
        }
        await prisma_1.prisma.store.delete({
            where: { id: storeId },
        });
        return res.status(200).json({ message: "Loja deletada com sucesso." });
    }
    catch (error) {
        return res.status(400).json(error);
    }
};
exports.deleteStore = deleteStore;
const getAllStore = async (req, res) => {
    const stores = await prisma_1.prisma.store.findMany({
        select: {
            id: true,
            name: true,
            User: {
                select: {
                    name: true,
                },
            },
            Product: {
                select: {
                    id: true,
                    name: true,
                    price: true,
                    amount: true,
                },
            },
        },
    });
    return res.json(stores);
};
exports.getAllStore = getAllStore;
const getUniqueStore = async (req, res) => {
    try {
        const { storeId } = req.params;
        const store = await prisma_1.prisma.store.findUnique({
            where: {
                id: storeId,
            },
            include: {
                Product: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        amount: true,
                    },
                },
            },
        });
        if (!store) {
            return res.status(404).json({ message: "Loja não encontrada" });
        }
        return res.status(200).json(store);
    }
    catch (error) {
        return res.status(400).json(error);
    }
};
exports.getUniqueStore = getUniqueStore;
