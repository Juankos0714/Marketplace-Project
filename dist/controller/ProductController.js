"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.getUniqueProduct = exports.getAllProducts = exports.updateProduct = exports.createProduct = void 0;
const prisma_1 = require("../database/prisma");
const createProduct = async (req, res) => {
    const { name, price, amount } = req.body;
    const { storeId } = req.params;
    const Product = await prisma_1.prisma.product.create({
        data: {
            name,
            price,
            amount,
            Store: {
                connect: {
                    id: storeId,
                },
            },
        },
    });
    return res.json(Product);
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    var _a;
    try {
        const { name, price, amount } = req.body;
        const { productId } = req.params;
        const { id } = req.user;
        const isProduct = await prisma_1.prisma.product.findUnique({
            where: {
                id: productId,
            },
            include: {
                Store: true,
            },
        });
        if (!isProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (id !== ((_a = isProduct === null || isProduct === void 0 ? void 0 : isProduct.Store) === null || _a === void 0 ? void 0 : _a.userId)) {
            return res
                .status(404)
                .json({ message: "Este produto não pertence a esse usuário" });
        }
        const Product = await prisma_1.prisma.product.update({
            where: {
                id: productId,
            },
            data: {
                name,
                price,
                amount,
            },
        });
        return res.status(200).json(Product);
    }
    catch (error) {
        return res.status(400).json(error);
    }
};
exports.updateProduct = updateProduct;
const getAllProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const Products = await prisma_1.prisma.product.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
    });
    return res.json(Products);
};
exports.getAllProducts = getAllProducts;
const getUniqueProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await prisma_1.prisma.product.findUnique({
            where: {
                id: productId,
            },
            select: {
                id: true,
                name: true,
                price: true,
                amount: true,
            },
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json(product);
    }
    catch (error) {
        return res.status(400).json(error);
    }
};
exports.getUniqueProduct = getUniqueProduct;
const deleteProduct = async (req, res) => {
    var _a;
    try {
        const { productId } = req.params;
        const { id } = req.user;
        const isProduct = await prisma_1.prisma.product.findUnique({
            where: {
                id: productId,
            },
            include: {
                Store: true,
            },
        });
        if (!isProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (id !== ((_a = isProduct === null || isProduct === void 0 ? void 0 : isProduct.Store) === null || _a === void 0 ? void 0 : _a.userId)) {
            return res
                .status(404)
                .json({ message: "Este produto não pertence a esse usuário" });
        }
        await prisma_1.prisma.product.delete({
            where: {
                id: productId,
            },
        });
        return res.status(204).json({ message: "Produto deletado com sucesso" });
    }
    catch (error) {
        return res.status(400).json(error);
    }
};
exports.deleteProduct = deleteProduct;
