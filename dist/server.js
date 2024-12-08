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
// Cargar variables de entorno desde .env
dotenv_1.default.config({ path: '.env' });
const app = (0, express_1.default)();
// Validar variables de entorno críticas
function validateEnvironment() {
    const criticalVars = ['JWT_SECRET', 'DATABASE_URL'];
    const missingVars = criticalVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
        console.error('Missing critical environment variables:', missingVars);
        process.exit(1);
    }
}
// Ensure the upload directory exists
const uploadDir = path_1.default.join(__dirname, '../src/public/images');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// Iniciar el servidor
function startServer() {
    try {
        // Middleware
        app.use(express_1.default.json());
        app.use((req, res, next) => {
            console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
            next();
        });
        // Servir archivos estáticos desde la carpeta src/public/images
        app.use('/images', express_1.default.static(uploadDir));
        // Router
        app.use(router_1.router);
        // Template Engine
        app.set("view engine", "ejs");
        app.set("views", path_1.default.resolve(__dirname, "views/"));
        // Global error handler
        app.use((err, req, res, next) => {
            console.error('Unhandled Error:', err);
            res.status(500).json({
                message: 'Internal Server Error',
                error: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
            });
        });
        const port = parseInt(process.env.PORT || '3333', 10);
        app.listen(port, () => {
            console.log(`Server running on port ${port} - http://localhost:${port}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
// Validar variables de entorno y iniciar el servidor
validateEnvironment();
startServer();
// Manejar promesas no manejadas
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
// Manejar excepciones no capturadas
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
