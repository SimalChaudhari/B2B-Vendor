import { IsNotEmpty, IsOptional, IsEnum, IsDecimal } from 'class-validator';
import { ProductStatus } from './product.entity';

export class CreateProductDto {
    @IsNotEmpty()
    name!: string;

    @IsNotEmpty()
    description!: string;

    @IsDecimal()
    price!: number;

    @IsOptional()
    imageUrl?: string;

    @IsEnum(ProductStatus)
    @IsOptional()
    status?: ProductStatus; // Status field

    @IsNotEmpty()
    subcategoryId!: string; // Subcategory ID

    @IsNotEmpty()
    stock_quantity!: number; // New field
}

export class UpdateProductDto {
    @IsOptional()
    name?: string;

    @IsOptional()
    description?: string;

    @IsOptional()
    price?: number;

    @IsOptional()
    imageUrl?: string;

    @IsEnum(ProductStatus)
    @IsOptional()
    status?: ProductStatus; // Status field

    @IsOptional()
    stock_quantity?: number; // New field

    @IsOptional()
    subcategoryId?: string; // Optional subcategory ID

}
