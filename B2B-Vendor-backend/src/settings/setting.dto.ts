// src/faq/dto/create-faq.dto.ts

import { IsNotEmpty, IsString, IsIn, IsEnum, IsOptional, IsEmail } from 'class-validator';
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

export class UpdateLogoDto extends PartialType(CreateLogoDto) { }


export class CreatePrivacyPolicyDto {
    @IsNotEmpty()
    @IsString()
    content!: string; // Content of the privacy policy

}

export class CreateTermsConditionsDto {
    @IsString()
    readonly id?: string; // Optional for creation, required for updates

    @IsNotEmpty()
    @IsString()
    readonly content?: string;
}

export class CreateContactDto {

    @IsString()
    readonly id?: string; // Optional for creation, required for updates

    @IsNotEmpty()
    @IsString()
    readonly message?: string;

}

export class CreateBannerDto {
    @IsNotEmpty()
    @IsString()
    name!: string; // URL/path to the logo image
}
export class UpdateBannerDto extends PartialType(CreateBannerDto) { }
