"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSalesBySeller = exports.getAllSalesByBuyer = exports.getAllSales = exports.createSale = void 0;
const prisma_1 = require("../database/prisma");
const createSale = async (req, res) => {
    try {
        const { products, userSellerId } = req.body;
        const { id } = req.user;
        const productsByDatabase = await prisma_1.prisma.product.findMany({
            where: {
                id: { in: products.map((product) => product.id) },
            },
        });
        const productWithQuantity = productsByDatabase.map((product) => {
            const { id, name, price } = product;
            const quantity = products.find((p) => p.id === product.id).quantity;
            return {
                id,
                name,
                price,
                quantity,
            };
        });
        let total = 0;
        for (const product of productWithQuantity) {
            total += product.price * parseInt(product.quantity);
        }
        if (id === userSellerId) {
            return res.status(400).json({
                message: "Não é possível criar uma venda com ID de comprador e vendedor iguais",
            });
        }
        const sale = await prisma_1.prisma.sale.create({
            data: {
                total_value: total,
                Seller: { connect: { id: userSellerId } },
                Buyer: { connect: { id } },
                SaleProduct: {
                    create: productWithQuantity.map((product) => ({
                        Product: { connect: { id: product.id } },
                        quantity: product.quantity,
                    })),
                },
            },
            include: {
                SaleProduct: true,
            },
        });
        productWithQuantity.map(async (product) => {
            await prisma_1.prisma.product.updateMany({
                where: { id: product.id },
                data: {
                    amount: {
                        decrement: parseInt(product.quantity),
                    },
                },
            });
        });
        return res
            .status(201)
            .json({ sale, message: "Compra realizada com sucesso." });
    }
    catch (error) {
        return res.status(400).json(error);
    }
};
exports.createSale = createSale;
const getAllSales = async (req, res) => {
    const sales = await prisma_1.prisma.sale.findMany({
        select: {
            id: true,
            total_value: true,
            Seller: {
                select: {
                    id: true,
                    name: true,
                },
            },
            Buyer: {
                select: {
                    id: true,
                    name: true,
                },
            },
            SaleProduct: {
                select: {
                    Product: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                        },
                    },
                    quantity: true,
                },
            },
            created_at: true,
        },
    });
    return res.status(200).json(sales);
};
exports.getAllSales = getAllSales;
const getAllSalesByBuyer = async (req, res) => {
    const { id } = req.user;
    const sales = await prisma_1.prisma.sale.findMany({
        where: {
            buyerId: id,
        },
        select: {
            id: true,
            total_value: true,
            Seller: {
                select: {
                    id: true,
                    name: true,
                },
            },
            Buyer: {
                select: {
                    id: true,
                    name: true,
                },
            },
            SaleProduct: {
                select: {
                    Product: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                        },
                    },
                    quantity: true,
                },
            },
            created_at: true,
        },
    });
    return res.status(200).json(sales);
};
exports.getAllSalesByBuyer = getAllSalesByBuyer;
const getAllSalesBySeller = async (req, res) => {
    const { id } = req.user;
    const sales = await prisma_1.prisma.sale.findMany({
        where: {
            sellerId: id,
        },
        select: {
            id: true,
            total_value: true,
            Seller: {
                select: {
                    id: true,
                    name: true,
                },
            },
            Buyer: {
                select: {
                    id: true,
                    name: true,
                },
            },
            SaleProduct: {
                select: {
                    Product: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                        },
                    },
                    quantity: true,
                },
            },
            created_at: true,
        },
    });
    return res.status(200).json(sales);
};
exports.getAllSalesBySeller = getAllSalesBySeller;
