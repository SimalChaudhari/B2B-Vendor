import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class ProductDto {
    @IsOptional()
    @IsString()
    itemName?: string;

    @IsOptional()
    @IsString()
    alias?: string;

    @IsOptional()
    @IsString()
    partNo?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    remarks?: string;

    @IsOptional()
    @IsString()
    group?: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    baseUnit?: string;

    @IsOptional()
    @IsString()
    alternateUnit?: string;

    @IsOptional()
    @IsString()
    isBatchWiseOn?: string;

    @IsOptional()
    @IsString()
    hasMfgDate?: string;

    @IsOptional()
    @IsString()
    hasExpiryDate?: string;

    @IsOptional()
    @IsString()
    costPriceDate?: string;

    @IsOptional()
    @IsString()
    costPrice?: string; // Changed from number to string

    @IsOptional()
    @IsString()
    sellingPriceDate?: string;

    @IsOptional()
    @IsString()
    sellingPrice?: string; // Changed from number to string

    @IsOptional()
    @IsString()
    gstApplicable!: string;

    @IsOptional()
    @IsString()
    gstApplicableDate?: string;

    @IsOptional()
    @IsString()
    gstRate?: string; // Changed from number to string

    @IsOptional()
    @IsString()
    mrpDate?: string;

    @IsOptional()
    @IsString()
    mrpRate?: string; // Changed from number to string

    // Add any additional fields here with appropriate validations
}
