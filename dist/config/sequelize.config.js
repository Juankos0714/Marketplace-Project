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
exports.initDatabase = exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_entity_1 = require("../entities/user.entity");
const videogame_entity_1 = require("../entities/videogame.entity");
const cart_entity_1 = require("../entities/cart.entity");
const dotenv_1 = __importDefault(require("dotenv"));
const env = process.env.NODE_ENV || 'development'; // Define env correctamente
if (env === 'development') {
    // Usa la variable correctamente
}
dotenv_1.default.config();
const validateEnv = () => {
    if (!process.env.DATABASE_URL) {
        throw new Error('Missing DATABASE_URL environment variable');
    }
    if (!['development', 'production'].includes(process.env.NODE_ENV || '')) {
        throw new Error('NODE_ENV must be set to "development" or "production"');
    }
};
const config = {
    development: {
        dialect: 'mysql',
        dialectModule: require('mysql2'),
        logging: console.log,
        ssl: true,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    },
    production: {
        dialect: 'mysql',
        dialectModule: require('mysql2'),
        logging: false,
        ssl: true,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    },
};
const currentConfig = config[env];
exports.sequelize = new sequelize_typescript_1.Sequelize(process.env.DATABASE_URL, Object.assign(Object.assign({}, currentConfig), { models: [user_entity_1.User, videogame_entity_1.Videogame, cart_entity_1.Cart], define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true,
    } }));
const initDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        validateEnv();
        yield exports.sequelize.authenticate();
        console.log('✅ Conexión a Railway MySQL establecida correctamente.');
        if (env === 'development') {
            yield exports.sequelize.sync({ alter: true });
            console.log('✅ Modelos sincronizados con la base de datos.');
        }
        else {
            yield exports.sequelize.sync();
            console.log('✅ Modelos verificados en la base de datos.');
        }
    }
    catch (error) {
        console.error('❌ Error al conectar con Railway MySQL:', error);
        throw error;
    }
});
exports.initDatabase = initDatabase;
//# sourceMappingURL=sequelize.config.js.map