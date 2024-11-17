import { IsNumber, IsUUID, Min } from "class-validator";

export class AddToCartDto {
  @IsUUID()
  videogameId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class UpdateCartDto {
  @IsNumber()
  @Min(1)
  quantity: number;
}