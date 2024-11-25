"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const sequelize_config_1 = require("./config/sequelize.config");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const auth_middleware_1 = require("./middleware/auth.middleware");
const createApp = async () => {
    try {
        // Inicializar base de datos
        await (0, sequelize_config_1.initDatabase)();
        const app = (0, express_1.default)();
        // Middlewares
        app.use((0, cors_1.default)());
        app.use((0, morgan_1.default)('dev'));
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        // Rutas básicas
        app.get('/health', (req, res) => {
            res.json({ status: 'OK', timestamp: new Date() });
        });
        // Ruta de login
        app.post('/login', (req, res) => {
            const { username, password } = req.body;
            // Validación simple (reemplazar con validación real)
            if (username === 'user' && password === 'password') {
                const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });
                return res.json({ token });
            }
            return res.status(401).send('Unauthorized');
        });
        // Ruta protegida
        app.get('/protected', auth_middleware_1.authMiddleware, (req, res) => {
            res.send('This is a protected route');
        });
        return app;
    }
    catch (error) {
        console.error('Error al crear la aplicación:', error);
        throw error;
    }
};
exports.createApp = createApp;
// Para iniciar el servidor
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    (0, exports.createApp)().then(app => {
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
        });
    }).catch(error => {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    });
}
