import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateAddressDto {
    @IsString()
    @IsNotEmpty()
    user_id!: string;

    @IsString()
    @IsNotEmpty()
    street_address!: string;

    @IsString()
    @IsNotEmpty()
    state!: string;

    @IsString()
    @IsNotEmpty()
    city!: string;

    @IsString()
    @IsNotEmpty()
    zip_code!: string;

    @IsString()
    @IsNotEmpty()
    country!: string;
}

export class UpdateAddressDto {
    @IsOptional()
    @IsString()
    street_address?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    state?: string;

    @IsOptional()
    @IsString()
    zip_code?: string;

    @IsOptional()
    @IsString()
    country?: string;
}
