import { IsNotEmpty, IsEnum, IsOptional, IsNumber } from 'class-validator';

export class CreateOrderDto {
    @IsNotEmpty()
    userId!: string;

    @IsOptional()
    awpNumber?: string;

    @IsOptional()
    shiprocketData?: string;

    @IsNotEmpty()
    @IsEnum(['Pending', 'Completed', 'Cancelled', 'Shipped'])
    status!: 'Pending' | 'Completed' | 'Cancelled' | 'Shipped';

    @IsNotEmpty()
    totalAmount!: number;

    @IsNotEmpty()
    @IsNumber()
    shippingAddressId!: number;

    @IsNotEmpty()
    @IsNumber()
    billingAddressId!: number;

    @IsNotEmpty()
    paymentMethod!: string;
}

export class UpdateOrderDto {
    @IsOptional()
    userId?: string;

    @IsOptional()
    awpNumber?: string;

    @IsOptional()
    shiprocketData?: string;

    @IsOptional()
    @IsEnum(['Pending', 'Completed', 'Cancelled', 'Shipped'])
    status?: 'Pending' | 'Completed' | 'Cancelled' | 'Shipped';

    @IsOptional()
    totalAmount?: number;

    @IsOptional()
    shippingAddressId?: number;

    @IsOptional()
    billingAddressId?: number;

    @IsOptional()
    paymentMethod?: string;
}
