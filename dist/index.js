"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const client_1 = require("@prisma/client");
const router_1 = require("./router");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(router_1.router);
app.use(express_1.default.static("public"));
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
//************************************* Template Engine *************************************\\
app.set("view engine", "ejs");
app.set("views", path_1.default.resolve(__dirname, "views/"));
//*********************************************************************************************\\
// const productsRouter = require("");
app.get('/', (_req, res) => {
    res.render('index.ejs');
});
app.get('/users', async (_req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});
app.post('/users', async (req, res) => {
    const { name, email } = req.body;
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: 'defaultPassword', // replace with actual password logic
        },
    });
    res.json(user);
});
// const port = process.env.PORT || 3333;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
// import express from "express";
// import { router } from "./router";
const port = process.env.PORT || '3333';
app.listen(`${port}`, () => console.log(`Server running on port ${port} - http://localhost:${port}`));
