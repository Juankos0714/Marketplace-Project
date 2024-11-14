import { Videogame } from '../types/videogame';

export const videogamesDB: Videogame[] = [
  {
    id: "1",
    title: "The Legend of Zelda: Breath of the Wild",
    description: "Explora un mundo abierto lleno de aventuras",
    genre: ["Acción", "Aventura", "RPG"],
    platform: ["Nintendo Switch", "Wii U"],
    publisher: "Nintendo",
    price: 59.99,
    imageUrl: ["zelda1.jpg", "zelda2.jpg", "zelda3.jpg"],
    inStock: true,
    quantity:10
  },
  {
    id: "2",
    title: "Red Dead Redemption 2",
    description: "Una épica historia del Salvaje Oeste",
    genre: ["Acción", "Aventura", "Mundo Abierto"],
    platform: ["PS4", "Xbox One", "PC"],
    publisher: "Rockstar Games",
    price: 49.99,
    imageUrl: ["rdd_II1.jpg","rdd_II2.jpg","rdd_II3.jpg"],
    inStock: true,
    quantity:10
  }
];

