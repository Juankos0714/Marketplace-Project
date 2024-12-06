"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/users', async (req, res) => {
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
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
