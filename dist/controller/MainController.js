"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = exports.allCategories = exports.carrito = exports.categories = exports.renderHomePage = void 0;
const prisma_1 = require("../database/prisma");
const renderHomePage = async (req, res) => {
    try {
        // Obtener todos los productos
        const products = await prisma_1.prisma.product.findMany();
        // Renderizar la vista y pasar los productos
        res.render("index", { products });
    }
    catch (err) {
        console.error("Error obteniendo productos:", err);
        res.status(500).render("errors/404.ejs"); // Renderizar página de error
    }
};
exports.renderHomePage = renderHomePage;
const categories = async (req, res) => {
    try {
        const category = await prisma_1.prisma.product.findMany({
            where: { category: req.params.nombre },
        });
        res.render("views/categories.ejs", { category });
    }
    catch (err) {
        console.log(err);
        res.render("errors/404.ejs");
    }
};
exports.categories = categories;
const carrito = async (req, res) => {
    try {
        const products = await prisma_1.prisma.product.findMany();
        res.render("product/productCart.ejs", { products });
    }
    catch (err) {
        console.log(err);
        res.render("errors/404.ejs");
    }
};
exports.carrito = carrito;
const allCategories = async (req, res) => {
    try {
        res.render("");
    }
    catch (err) {
        res.render("errors/404.ejs");
    }
};
exports.allCategories = allCategories;
const admin = async (req, res) => {
    try {
        const users = await prisma_1.prisma.user.findMany();
        const products = await prisma_1.prisma.product.findMany();
        res.render("admin.ejs", { users, products });
    }
    catch (err) {
        console.log(err);
        res.render("errors/404.ejs");
    }
};
exports.admin = admin;
const mainController = {
    index: async (req, res) => {
        try {
            const products = await prisma_1.prisma.product.findMany();
            const topSeller = await prisma_1.prisma.product.findMany({
                where: { price: { gt: 120 } },
                take: 10,
            });
            const newsComments = await prisma_1.prisma.product.findMany({
                where: { price: { gt: 80 } },
                take: 3,
            });
            const newsAdd = await prisma_1.prisma.product.findMany({
                orderBy: { id: "desc" },
                take: 3,
            });
            const offerts = await prisma_1.prisma.product.findMany({
                where: { price: { lt: 100 } },
            });
            res.render("index", { products });
        }
        catch (err) {
            console.log(err);
            res.render("errors/404.ejs");
        }
    },
};
exports.default = mainController;
