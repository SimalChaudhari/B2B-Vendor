import { IsNotEmpty, IsUUID, IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItem {
    @IsNotEmpty()
    @IsUUID()
    productId!: string;

    @IsNotEmpty()
    @IsNumber()
    quantity!: number;
}

export class CreateOrderDto {
    @IsNotEmpty()
    @IsUUID()
    customerId!: string;

    @IsNotEmpty()
    @IsString()
    paymentMethod!: string;

    @IsNotEmpty()
    @IsString()
    shippingAddress?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItem)
    items!: OrderItem[];
}
