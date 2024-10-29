// cart.dto.ts
import { IsNotEmpty, IsUUID, IsNumber, Min } from 'class-validator';

export class AddToCartItemDto  {
  @IsNotEmpty()
  @IsUUID()
  productId!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity!: number;
}

export class AddToCartDto {
  items?: AddToCartItemDto[]; // Array of items
}
