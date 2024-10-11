// item.dto.js
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsDateString, IsArray } from 'class-validator';

export class ItemDto {
    @IsNotEmpty()
    @IsString()
    itemName!: string;

    @IsOptional()
    @IsString()
    alias!: string;

    @IsOptional()
    @IsString()
    partNo?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsString()
    group?: string;

    @IsNotEmpty()
    @IsString()
    subGroup1!: string;

    @IsNotEmpty()
    @IsString()
    subGroup2!: string;

    @IsNotEmpty()
    @IsString()
    baseUnit?: string;

    @IsNotEmpty()
    @IsString()
    alternateUnit?: string;

    @IsOptional()
    @IsString()
    conversion?: string;

    @IsNotEmpty()
    @IsNumber()
    denominator?: number;

    @IsNotEmpty()
    @IsDateString()
    sellingPriceDate?: Date;

    @IsNotEmpty()
    @IsNumber()
    sellingPrice?: number;

    @IsNotEmpty()
    @IsString()
    gstApplicable?: string;

    @IsNotEmpty()
    @IsDateString()
    gstApplicableDate?: Date;

    @IsNotEmpty()
    @IsString()
    taxability?: string;

    @IsNotEmpty()
    @IsNumber()
    gstRate?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    productImages?: string[];  // Array of image URLs

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    dimensionalFiles?: string[]; // Array of file URLs (pdf/images)
}
