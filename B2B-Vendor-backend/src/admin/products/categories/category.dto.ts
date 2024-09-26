import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { CategoryStatus } from './category.entity';

export class CreateCategoryDto {
    @IsNotEmpty()
    name!: string;

    @IsOptional()
    description?: string;

    @IsEnum(CategoryStatus)
    @IsOptional()
    status?: CategoryStatus; // Status field
}

export class UpdateCategoryDto {
    @IsOptional()
    name?: string;

    @IsOptional()
    description?: string;

    @IsEnum(CategoryStatus)
    @IsOptional()
    status?: CategoryStatus; // Status field
}
