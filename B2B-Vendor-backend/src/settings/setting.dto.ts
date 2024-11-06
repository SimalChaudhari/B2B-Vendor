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
    @IsNotEmpty()
    @IsString()
    content!: string; // Content of the terms and conditions
}

export class CreateContactDto {
    @IsNotEmpty()
    @IsString()
    name!: string; // Sender's name

    @IsNotEmpty()
    @IsEmail()
    email!: string; // Sender's email address

    @IsNotEmpty()
    @IsString()
    message!: string; // The message sent by the user

}

export class CreateBannerDto {
    @IsNotEmpty()
    @IsString()
    name!: string; // URL/path to the logo image
}
export class UpdateBannerDto extends PartialType(CreateBannerDto) { }
