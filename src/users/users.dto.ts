import { IsEmail, IsMobilePhone, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export enum UserRole {
    Admin = 'Admin',
    Customer = 'Customer',
    Vendor = 'Vendor',
}

export enum UserStatus {
    Active = 'Active',
    Suspended = 'Suspended',
}


export class UpdateUserDto {
    @IsNotEmpty()
    firstName?: string;

    @IsNotEmpty()
    lastName?: string;

    @IsOptional()
    profile?: string;

    @IsEmail()
    email?: string;

    @IsNotEmpty()
    mobile?: string;

    @IsNotEmpty()
    country?: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @IsOptional()
    @IsEnum(UserStatus)
    status?: UserStatus;

}
