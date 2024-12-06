"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.getUniqueProduct = exports.getAllProducts = exports.updateProduct = exports.createProduct = void 0;
const prisma_1 = require("../database/prisma");
const multerConfig_1 = require("../middlewares/multerConfig");
const createProduct = async (req, res) => {
    multerConfig_1.upload.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        try {
            const { name, description, category, platform, price, amount } = req.body;
            const storeId = parseInt(req.params.storeId, 10);
            if (!name || !description || !category || !platform || !price || !amount) {
                return res.status(400).json({ error: "Todos los campos son requeridos" });
            }
            const image = req.file ? req.file.path : '';
            const product = await prisma_1.prisma.product.create({
                data: {
                    name,
                    description,
                    image,
                    category,
                    platform,
                    price,
                    amount,
                    storeId,
                },
            });
            return res.status(201).json(product);
        }
        catch (error) {
            console.error("Error al crear producto:", error);
            return res.status(500).json({ error: "Error al crear el producto" });
        }
    });
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    multerConfig_1.upload.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        try {
            const { name, description, category, platform, price, amount } = req.body;
            const productId = parseInt(req.params.productId, 10);
            const userId = parseInt(req.user.id, 10);
            const isProduct = await prisma_1.prisma.product.findUnique({
                where: {
                    id: productId,
                },
                include: {
                    Store: true,
                },
            });
            if (!isProduct) {
                return res.status(404).json({ message: "Producto no encontrado" });
            }
            if (userId !== isProduct?.Store?.userId) {
                return res.status(403).json({ message: "Este producto no pertenece a este usuario" });
            }
            const image = req.file ? req.file.path : isProduct.image;
            const product = await prisma_1.prisma.product.update({
                where: {
                    id: productId,
                },
                data: {
                    name,
                    description,
                    image,
                    category,
                    platform,
                    price,
                    amount,
                },
            });
            return res.status(200).json(product);
        }
        catch (error) {
            return res.status(400).json(error);
        }
    });
};
exports.updateProduct = updateProduct;
const getAllProducts = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.perPage, 10) || 10;
    const products = await prisma_1.prisma.product.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
    });
    return res.json(products);
};
exports.getAllProducts = getAllProducts;
const getUniqueProduct = async (req, res) => {
    try {
        const productId = parseInt(req.params.productId, 10);
        const product = await prisma_1.prisma.product.findUnique({
            where: {
                id: productId,
            },
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
        });
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        return res.status(200).json(product);
    }
    catch (error) {
        return res.status(400).json(error);
    }
};
exports.getUniqueProduct = getUniqueProduct;
const deleteProduct = async (req, res) => {
    try {
        const productId = parseInt(req.params.productId, 10);
        const userId = parseInt(req.user.id, 10);
        const isProduct = await prisma_1.prisma.product.findUnique({
            where: {
                id: productId,
            },
            include: {
                Store: true,
            },
        });
        if (!isProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        if (userId !== isProduct?.Store?.userId) {
            return res.status(403).json({ message: "Este producto no pertenece a este usuario" });
        }
        await prisma_1.prisma.product.delete({
            where: {
                id: productId,
            },
        });
        return res.status(204).json({ message: "Producto eliminado exitosamente" });
    }
    catch (error) {
        return res.status(400).json(error);
    }
};
exports.deleteProduct = deleteProduct;
