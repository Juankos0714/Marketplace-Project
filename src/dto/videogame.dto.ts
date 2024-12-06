export interface CreateVideogameDto {
  id:number;
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

export interface UpdateVideogameDto extends Partial<CreateVideogameDto> {}
