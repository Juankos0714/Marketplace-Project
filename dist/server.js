"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const router_1 = require("./router");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config({ path: '.env.local' });
const app = (0, express_1.default)();
// Enhanced error handling for application startup
function startServer() {
    try {
        // Middleware
        app.use(express_1.default.json());
        app.use((req, res, next) => {
            console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
            next();
        });
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
// Validate critical environment variables
function validateEnvironment() {
    const criticalVars = ['JWT_SECRET', 'DATABASE_URL'];
    const missingVars = criticalVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
        console.error('Missing critical environment variables:', missingVars);
        process.exit(1);
    }
}
// Run environment validation and server startup
validateEnvironment();
startServer();
// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
