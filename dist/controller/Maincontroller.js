"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainController = void 0;
exports.mainController = {
    index: async (_req, res) => {
        try {
            // const products = await prisma.product.findMany();
            res.render("index");
        }
        catch (error) {
            res.status(500).send("Error al obtener los productos");
        }
    }
};
