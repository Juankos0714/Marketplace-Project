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
// Determinar el entorno y cargar las variables de entorno adecuadas
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.local';
dotenv_1.default.config({ path: envFile });
// Validar variables de entorno críticas
function validateEnvironment() {
    const criticalVars = ['JWT_SECRET', 'DATABASE_URL'];
    const missingVars = criticalVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
        console.error('Missing critical environment variables:', missingVars);
        process.exit(1);
    }
}
function startServer() {
    const app = (0, express_1.default)();
    try {
        // Configuración de CORS
        app.use((0, cors_1.default)({
            origin: [
                'http://localhost:5432',
                'https://marketplace-project-eta.vercel.app/',
                /\.vercel\.app$/
            ],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));
        // Configuración de carpetas estáticas
        app.use(express_1.default.static("public"));
        // Ensure the upload directory exists
        const uploadDir = path_1.default.join(__dirname, '../public/images');
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        // Middleware
        app.use(express_1.default.json());
        app.use((req, res, next) => {
            console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
            next();
        });
        // Servir archivos estáticos desde la carpeta public/images
        app.use('/images', express_1.default.static(uploadDir));
        // Router
        app.use(router_1.router);
        // Template Engine
        app.set("view engine", "ejs");
        app.set("views", path_1.default.join(__dirname, "views"));
        // Global error handler
        app.use((err, req, res, next) => {
            console.error('Unhandled Error:', err);
            res.status(500).json({
                message: 'Internal Server Error',
                error: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
            });
        });
        const port = parseInt(process.env.PORT || '3333', 10);
        const server = app.listen(port, () => {
            console.log(`Server running on port ${port} - http://localhost:${port}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`Port ${port} is already in use. Trying another port...`);
                const newServer = app.listen(0, () => {
                    const address = newServer.address();
                    if (typeof address === 'string') {
                        console.log(`Server running on ${address}`);
                    }
                    else if (address && address.port) {
                        console.log(`Server running on port ${address.port}`);
                    }
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
// Event handlers for unhandled errors
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
// Iniciar el servidor
validateEnvironment();
startServer();
