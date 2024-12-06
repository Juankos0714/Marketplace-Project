"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUniqueStore = exports.getAllStore = exports.deleteStore = exports.updateStore = exports.createStore = exports.getStoreWithProducts = void 0;
const prisma_1 = require("../database/prisma");
const getStoreWithProducts = async (req, res) => {
    try {
        const { storeId } = req.params;
        const store = await prisma_1.prisma.store.findUnique({
            where: { id: Number(storeId) },
            include: { products: true }
        });
        if (!store) {
            return res.status(404).json({ message: "Tienda no encontrada" });
        }
        return res.json(store);
    }
    catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
    }
};
exports.getStoreWithProducts = getStoreWithProducts;
const createStore = async (req, res) => {
    const { name } = req.body;
    const { id } = req.user;
    const isUser = await prisma_1.prisma.user.findUnique({
        where: {
            id: Number(id),
        },
    });
    if (!isUser) {
        return res.status(400).json({ message: "El usuario no existe" });
    }
    const store = await prisma_1.prisma.store.create({
        data: {
            name,
            User: {
                connect: {
                    id: Number(id),
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
                id: Number(storeId),
            },
        });
        if (!isStore) {
            return res.status(404).json({ message: "Tienda no encontrada" });
        }
        if (Number(id) !== isStore.userId) {
            return res.status(400).json({ message: "El usuario no es el propietario de esta Tienda" });
        }
        const store = await prisma_1.prisma.store.update({
            where: { id: Number(storeId) },
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
                id: Number(storeId),
            },
        });
        if (!isStore) {
            return res.status(404).json({ message: "Tienda no encontrada" });
        }
        if (Number(id) !== isStore.userId) {
            return res.status(400).json({ message: "El usuario no es el propietario de esta Tienda" });
        }
        await prisma_1.prisma.store.delete({
            where: { id: Number(storeId) },
        });
        return res.status(200).json({ message: "Tienda eliminada correctamente." });
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
            products: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    image: true,
                    category: true,
                    platform: true,
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
                id: Number(storeId),
            },
            include: {
                products: true,
                User: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        if (!store) {
            return res.status(404).json({ message: "Tienda no encontrada" });
        }
        return res.status(200).json(store);
    }
    catch (error) {
        return res.status(400).json(error);
    }
};
exports.getUniqueStore = getUniqueStore;
