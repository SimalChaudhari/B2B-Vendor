import { Type } from 'class-transformer';
import { ArrayMinSize, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

export class CreateOrderDto {

    @IsNotEmpty()
    cartId?: string; // Address ID for the order


    @IsNotEmpty()
    addressId?: string; // Address ID for the order

    @IsNumber()
    totalPrice?: number; // Total price of the order
}

export class ProductOrderDto {
    @IsNotEmpty()
    productId!: string;

    @IsNumber()
    quantity!: number;
}

export class CreateItemOrderDto {

    @IsNotEmpty()
    orderId!: string;

    @ValidateNested({ each: true })
    @Type(() => ProductOrderDto)
    @ArrayMinSize(1) // Ensure there's at least one item
    products!: ProductOrderDto[];
}