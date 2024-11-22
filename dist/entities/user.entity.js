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
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserRole = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const cart_entity_1 = require("./cart.entity");
// Mantenemos el enum UserRole
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
let User = User_1 = class User extends sequelize_typescript_1.Model {
    // Método para las asociaciones
    static associate(models) {
        User_1.hasMany(models.Cart, {
            foreignKey: 'userId',
            as: 'carts'
        });
    }
    // Método helper para verificar si es admin
    isAdmin() {
        return this.role === UserRole.ADMIN;
    }
};
exports.User = User;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: {
                msg: "Invalid email format"
            }
        }
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [6, 100],
                msg: "Password must be at least 6 characters long"
            }
        }
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM(...Object.values(UserRole)),
        defaultValue: UserRole.USER,
        validate: {
            isIn: {
                args: [Object.values(UserRole)],
                msg: "Invalid role type"
            }
        }
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => cart_entity_1.Cart),
    __metadata("design:type", Array)
], User.prototype, "carts", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: 'created_at'
    }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: 'updated_at'
    }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
exports.User = User = User_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'users',
        timestamps: true
    })
], User);
//# sourceMappingURL=user.entity.js.map