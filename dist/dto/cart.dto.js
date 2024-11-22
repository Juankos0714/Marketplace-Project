"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartDto = void 0;
class CartDto {
    // Constructor opcional para asignación más rápida
    constructor(videogameId, quantity) {
        this.videogameId = ''; // Inicializamos con una cadena vacía
        this.quantity = 1; // Inicializamos con un valor predeterminado
        if (videogameId)
            this.videogameId = videogameId;
        if (quantity)
            this.quantity = quantity;
    }
}
exports.CartDto = CartDto;
//# sourceMappingURL=cart.dto.js.map