"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const router_1 = require("./router");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const UploadMiddleware_1 = require("./middlewares/UploadMiddleware"); // Importa el middleware de subida
// Configuración de variables de entorno
dotenv_1.default.config({ path: process.env.NODE_ENV === 'production' ? '.env' : '.env.local' });
// Funciones auxiliares
function validateEnvironment() {
    const criticalVars = [
        { name: 'JWT_SECRET', required: true },
        { name: 'DATABASE_URL', required: true },
    ];
    const missingVars = criticalVars.filter(varObj => varObj.required && !process.env[varObj.name]);
    if (missingVars.length > 0) {
        console.error('Missing critical environment variables:', missingVars.map(v => v.name).join(', '));
        process.exit(1);
    }
}
function ensureDirectoryExists(directoryPath) {
    if (!fs_1.default.existsSync(directoryPath)) {
        fs_1.default.mkdirSync(directoryPath, { recursive: true });
    }
}
// Iniciar servidor
function startServer() {
    const app = (0, express_1.default)();
    try {
        app.use((0, helmet_1.default)());
        const allowedOrigins = [
            'http://localhost:5432',
            'https://marketplace-project-eta.vercel.app'
        ];
        app.use((0, cors_1.default)({
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.some(allowedOrigin => origin.match(allowedOrigin))) {
                    callback(null, true);
                }
                else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));
        ensureDirectoryExists(path_1.default.join(__dirname, '../public/images/products'));
        app.use(express_1.default.static("public"));
        app.use(express_1.default.json());
        app.use((0, morgan_1.default)('combined'));
        app.use('/images/products', express_1.default.static(path_1.default.join(__dirname, '../public/images/products')));
        app.use(router_1.router);
        app.post('/upload-single', UploadMiddleware_1.upload.single('image'), (req, res) => {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }
            res.json({ imageUrl: req.file.path });
        });
        app.post('/upload-multiple', UploadMiddleware_1.upload.array('images', 5), (req, res) => {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: 'No files uploaded' });
            }
            const files = req.files;
            res.json({ imageUrls: files.map(file => file.path) });
        });
        app.set("view engine", "ejs");
        app.set("views", path_1.default.join(__dirname, "views"));
        app.use((err, req, res, next) => {
            console.error('Unhandled Error:', err.stack);
            res.status(500).json({
                message: 'Internal Server Error',
                ...(process.env.NODE_ENV === 'development' && { stack: err.stack, error: err.message })
            });
        });
        const port = parseInt(process.env.PORT || '3333', 10);
        const server = app.listen(port, () => {
            console.log(`Server running on port ${port} - http://localhost:${port}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`Port ${port} is in use. Trying another port...`);
                const newServer = app.listen(0, () => {
                    const newPort = newServer.address().port;
                    console.log(`Server running on new port ${newPort} - http://localhost:${newPort}`);
                });
            }
            else {
                console.error('Failed to start server:', err);
                process.exit(1);
            }
        });
    }
    catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
validateEnvironment();
startServer();
