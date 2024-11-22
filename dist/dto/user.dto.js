"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDto = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["Admin"] = "admin";
    UserRole["User"] = "user";
})(UserRole || (exports.UserRole = UserRole = {}));
class UserDto {
    // Constructor opcional
    constructor(email, password, role) {
        this.email = ''; // Cadena vacía como valor predeterminado
        this.password = ''; // Cadena vacía como valor predeterminado
        this.role = UserRole.User; // Rol predeterminado
        if (email)
            this.email = email;
        if (password)
            this.password = password;
        if (role)
            this.role = role;
    }
}
exports.UserDto = UserDto;
//# sourceMappingURL=user.dto.js.map