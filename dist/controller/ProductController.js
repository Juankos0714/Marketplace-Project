"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.getUniqueProduct = exports.getAllProducts = exports.updateProduct = exports.createProduct = exports.prisma = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
const multer_1 = require("../config/multer");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const router = (0, express_1.Router)();
const createProduct = async (req, res) => {
    multer_1.upload.single('image')(req, res, async (err) => {
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
            const product = await exports.prisma.product.create({
                data: {
                    name,
                    description,
                    image,
                    category,
                    platform,
                    price: parseFloat(price),
                    amount: parseInt(amount, 10),
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
    multer_1.upload.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        try {
            const { name, description, category, platform, price, amount } = req.body;
            const productId = parseInt(req.params.productId, 10);
            const userId = parseInt(req.user.id, 10);
            const isProduct = await exports.prisma.product.findUnique({
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
            const product = await exports.prisma.product.update({
                where: {
                    id: productId,
                },
                data: {
                    name,
                    description,
                    image,
                    category,
                    platform,
                    price: parseFloat(price),
                    amount: parseInt(amount, 10),
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
    const products = await exports.prisma.product.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
    });
    return res.json(products);
};
exports.getAllProducts = getAllProducts;
const getUniqueProduct = async (req, res) => {
    try {
        const productId = parseInt(req.params.productId, 10);
        const product = await exports.prisma.product.findUnique({
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
        const isProduct = await exports.prisma.product.findUnique({
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
        await exports.prisma.product.delete({
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
// For single image upload
router.post('/upload-single', uploadMiddleware_1.uploadSingle, async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    // Access the file info
    const imageUrl = `/images/${req.file.filename}`;
    // Save to database or process further
    // ...
    res.json({ imageUrl });
});
// For multiple images
router.post('/upload-multiple', uploadMiddleware_1.uploadMultiple, async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
    }
    const files = req.files;
    const imageUrls = files.map(file => `/images/${file.filename}`);
    // Save to database or process further
    // ...
    res.json({ imageUrls });
});
router.post('/product/:storeId', uploadMiddleware_1.uploadSingle, exports.createProduct);
router.put('/update-product/:productId', uploadMiddleware_1.uploadSingle, exports.updateProduct);
exports.default = router;
