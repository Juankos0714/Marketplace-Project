"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Videogame_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Videogame = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const cart_entity_1 = require("./cart.entity");
let Videogame = Videogame_1 = class Videogame extends sequelize_typescript_1.Model {
    // Método para las asociaciones
    static associate(models) {
        Videogame_1.hasMany(models.Cart, {
            foreignKey: 'videogameId',
            as: 'cartItems'
        });
    }
    // Métodos helper útiles
    isAvailable() {
        return this.inStock;
    }
    getFormattedPrice() {
        return `$${this.price.toFixed(2)}`;
    }
    getGenresString() {
        return this.genre.join(', ');
    }
    getPlatformsString() {
        return this.platform.join(', ');
    }
};
exports.Videogame = Videogame;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        primaryKey: true,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4
    }),
    __metadata("design:type", String)
], Videogame.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false
    }),
    __metadata("design:type", String)
], Videogame.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false
    }),
    __metadata("design:type", String)
], Videogame.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON, // Usando JSON para arrays
        get() {
            const rawValue = this.getDataValue('genre');
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
            this.setDataValue('genre', JSON.stringify(value));
        }
    }),
    __metadata("design:type", Array)
], Videogame.prototype, "genre", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON, // Usando JSON para arrays
        get() {
            const rawValue = this.getDataValue('platform');
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
            this.setDataValue('platform', JSON.stringify(value));
        }
    }),
    __metadata("design:type", Array)
], Videogame.prototype, "platform", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false
    }),
    __metadata("design:type", String)
], Videogame.prototype, "publisher", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false
    }),
    __metadata("design:type", Date)
], Videogame.prototype, "releaseDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(3, 1),
        validate: {
            min: 0,
            max: 10
        }
    }),
    __metadata("design:type", Number)
], Videogame.prototype, "rating", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
        validate: {
            min: 0
        }
    }),
    __metadata("design:type", Number)
], Videogame.prototype, "price", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false
    }),
    __metadata("design:type", String)
], Videogame.prototype, "imageUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: true
    }),
    __metadata("design:type", Boolean)
], Videogame.prototype, "inStock", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => cart_entity_1.Cart),
    __metadata("design:type", Array)
], Videogame.prototype, "cartItems", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.NOW),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: 'created_at'
    }),
    __metadata("design:type", Date)
], Videogame.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.NOW),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: 'updated_at'
    }),
    __metadata("design:type", Date)
], Videogame.prototype, "updatedAt", void 0);
exports.Videogame = Videogame = Videogame_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'videogames',
        timestamps: true
    })
], Videogame);
//# sourceMappingURL=videogame.entity.js.map