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
var Cart_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_entity_1 = require("./user.entity");
const videogame_entity_1 = require("./videogame.entity");
let Cart = Cart_1 = class Cart extends sequelize_typescript_1.Model {
    // Método de ayuda para calcular el precio total
    getTotalPrice() {
        return this.quantity * this.unitPrice;
    }
    // Métodos adicionales que Sequelize necesita para las relaciones
    static associate(models) {
        Cart_1.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
        Cart_1.belongsTo(models.Videogame, {
            foreignKey: 'videogameId',
            as: 'videogame'
        });
    }
};
exports.Cart = Cart;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }),
    __metadata("design:type", Number)
], Cart.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_entity_1.User),
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        field: 'user_id'
    }),
    __metadata("design:type", Number)
], Cart.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_entity_1.User, {
        onDelete: 'CASCADE'
    }),
    __metadata("design:type", user_entity_1.User)
], Cart.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => videogame_entity_1.Videogame),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        field: 'videogame_id'
    }),
    __metadata("design:type", Number)
], Cart.prototype, "videogameId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => videogame_entity_1.Videogame, {
        onDelete: 'CASCADE'
    }),
    __metadata("design:type", videogame_entity_1.Videogame)
], Cart.prototype, "videogame", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        defaultValue: 1,
        validate: {
            min: 1
        }
    }),
    __metadata("design:type", Number)
], Cart.prototype, "quantity", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
        field: 'unit_price'
    }),
    __metadata("design:type", Number)
], Cart.prototype, "unitPrice", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
        defaultValue: 'pending',
        validate: {
            isIn: [['pending', 'saved_for_later', 'removed']]
        }
    }),
    __metadata("design:type", String)
], Cart.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: 'created_at'
    }),
    __metadata("design:type", Date)
], Cart.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: 'updated_at'
    }),
    __metadata("design:type", Date)
], Cart.prototype, "updatedAt", void 0);
exports.Cart = Cart = Cart_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'carts',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['userId', 'videogameId']
            }
        ]
    })
], Cart);
//# sourceMappingURL=cart.entity.js.map