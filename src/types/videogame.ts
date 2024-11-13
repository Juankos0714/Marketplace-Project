export interface Videogame {
    id: string;
    title: string;
    description: string;
    genre: string[];
    platform: string[];
    publisher: string;
    releaseDate: Date;
    rating: number;
    price: number;
    imageUrl: string;
    inStock: boolean;
  }