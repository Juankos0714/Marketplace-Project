"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const sequelize_config_1 = require("./config/sequelize.config");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const createApp = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Inicializar base de datos
        yield (0, sequelize_config_1.initDatabase)();
        const app = (0, express_1.default)();
        // Middlewares
        app.use((0, cors_1.default)());
        app.use((0, morgan_1.default)('dev'));
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        // Rutas básicas
        app.get('/health', (_req, res) => {
            res.json({
                status: 'OK',
                timestamp: new Date(),
                environment: process.env.NODE_ENV || 'development'
            });
        });
        // Manejador de errores global
        app.use((err, _req, res, _next) => {
            console.error('Error no manejado:', err);
            res.status(500).json({
                status: 'error',
                message: process.env.NODE_ENV === 'production'
                    ? 'Internal Server Error'
                    : err.message
            });
        });
        return app;
    }
    catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        throw error;
    }
});
exports.createApp = createApp;
// Para iniciar el servidor
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    (0, exports.createApp)()
        .then(app => {
        const server = app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
            console.log(`🔗 Health check disponible en: http://localhost:${PORT}/health`);
        });
        // Manejo de señales de terminación
        process.on('SIGTERM', () => {
            console.log('SIGTERM recibido. Cerrando servidor...');
            server.close(() => {
                console.log('Servidor cerrado.');
                process.exit(0);
            });
        });
    })
        .catch(error => {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=index.js.map