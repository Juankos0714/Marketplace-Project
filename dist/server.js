"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const router_1 = require("./router");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(router_1.router);
//************************************* Template Engine *************************************\\
app.set("view engine", "ejs");
app.set("views", path_1.default.resolve(__dirname, "views/"));
const port = process.env.PORT || '3333';
app.listen(`${port}`, () => console.log(`Server running on port ${port} - http://localhost:${port}`));
