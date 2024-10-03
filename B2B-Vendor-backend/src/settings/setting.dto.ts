// src/faq/dto/create-faq.dto.ts

import { IsNotEmpty, IsString, IsIn, IsEnum, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { FAQStatus } from './setting.entity';

export class CreateFaqDto {
    @IsNotEmpty()
    @IsString()
    question!: string;

    @IsNotEmpty()
    @IsString()
    answer!: string;

    @IsEnum(FAQStatus)
    @IsOptional()
    status?: FAQStatus; // Status field
}

export class UpdateFaqDto extends PartialType(CreateFaqDto) { }

export class CreateLogoDto {
    @IsNotEmpty()
    @IsString()
    logoImage!: string; // URL/path to the logo image
}