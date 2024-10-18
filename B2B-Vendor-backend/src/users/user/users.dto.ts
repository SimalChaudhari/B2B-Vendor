//users.dto.ts
import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsNumber, IsEmail, IsEnum } from 'class-validator';

export enum UserRole {
    Admin = 'Admin',
    Customer = 'Customer',
    Vendor = 'Vendor',
}

export enum UserStatus {
    Active = 'Active',
    Suspended = 'Suspended',
}

export class VendorDto {
    @IsNotEmpty()
    @IsString()
    name?: string;

    @IsNotEmpty()
    @IsString()
    slNo?: string;

    @IsOptional()
    @IsString()
    alias?: string;

    @IsNotEmpty()
    @IsString()
    active?: string;

    @IsOptional()
    @IsString()
    parent?: string; // You can replace this with a more specific type if needed

    @IsNotEmpty()
    @IsString()
    address?: string;

    @IsNotEmpty()
    @IsString()
    country?: string;

    @IsNotEmpty()
    @IsString()
    state?: string;

    @IsNotEmpty()
    @IsString()
    pincode?: string;

    @IsNotEmpty()
    @IsString()
    contactPerson?: string;

    @IsNotEmpty()
    @IsString()
    mobile?: string;

    @IsNotEmpty()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    pan?: string;

    @IsNotEmpty()
    @IsString()
    gstType?: string; // e.g., Regular, Composition

    @IsNotEmpty()
    @IsString()
    gstNo?: string;

    @IsOptional()
    @IsString()
    gstDetails?: string; // Optional additional details

    @IsOptional()
    profile?: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @IsOptional()
    otp?: string | null;

    @IsOptional()
    otpExpires?: Date | null;

    @IsOptional()
    isDeleted?: boolean;

    @IsOptional()
    createdAt?: Date;

    @IsOptional()
    updatedAt?: Date;
}



