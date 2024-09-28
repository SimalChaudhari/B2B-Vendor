import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { SubcategoryStatus } from './subcategory.entity';

export class CreateSubcategoryDto {
    @IsNotEmpty()
    name!: string;

    @IsOptional()
    description?: string;

    @IsEnum(SubcategoryStatus)
    @IsOptional()
    status?: SubcategoryStatus; // Status field

    @IsNotEmpty()
    categoryId!: string; // Category ID
}

export class UpdateSubcategoryDto {
    @IsOptional()
    name?: string;

    @IsOptional()
    description?: string;

    @IsEnum(SubcategoryStatus)
    @IsOptional()
    status?: SubcategoryStatus; // Status field

    @IsOptional()
    categoryId?: string;

}
