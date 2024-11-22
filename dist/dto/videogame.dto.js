"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideogameDto = void 0;
class VideogameDto {
    // Constructor opcional
    constructor(title, description, genre, platform, publisher, releaseDate, rating, price, imageUrl, inStock) {
        this.title = ''; // Cadena vacía
        this.description = ''; // Cadena vacía
        this.genre = []; // Arreglo vacío
        this.platform = []; // Arreglo vacío
        this.publisher = ''; // Cadena vacía
        this.releaseDate = new Date(); // Fecha actual como predeterminada
        this.rating = 0; // Inicializar con 0
        this.price = 0; // Inicializar con 0
        this.imageUrl = ''; // Cadena vacía
        this.inStock = false; // Predeterminado a `false`
        if (title)
            this.title = title;
        if (description)
            this.description = description;
        if (genre)
            this.genre = genre;
        if (platform)
            this.platform = platform;
        if (publisher)
            this.publisher = publisher;
        if (releaseDate)
            this.releaseDate = releaseDate;
        if (rating)
            this.rating = rating;
        if (price)
            this.price = price;
        if (imageUrl)
            this.imageUrl = imageUrl;
        if (inStock !== undefined)
            this.inStock = inStock;
    }
}
exports.VideogameDto = VideogameDto;
//# sourceMappingURL=videogame.dto.js.map