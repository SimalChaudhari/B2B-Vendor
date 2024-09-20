// auth.dto.ts
import { IsEmail, IsMobilePhone, IsNotEmpty, Length, MinLength, IsString, IsEnum, IsOptional } from 'class-validator';

export enum UserRole {
  Admin = 'Admin',
  Customer = 'Customer',
  Vendor = 'Vendor',
}

export enum UserStatus {
  Active = 'Active',
  Suspended = 'Suspended',
}

export class Address {
  @IsNotEmpty()
  street!: string;

  @IsNotEmpty()
  city!: string;

  @IsNotEmpty()
  state!: string;

  @IsNotEmpty()
  pinCode!: string;
}

export class AuthDto {

  @IsNotEmpty()
  firstName!: string;

  @IsNotEmpty()
  lastName!: string;

  @IsOptional()
  profile?: string;

  @IsEmail()
  email!: string;

  @MinLength(10, { message: 'Mobile Number 10 Should have a 10 digit' }) // Corrected to use @MinLength
  @IsMobilePhone()
  mobile!: number;

  @MinLength(6, { message: 'Password must be at least 6 characters long' }) // Corrected to use @MinLength
  password!: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole; // Optional role field

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus; // Optional status field

  @IsOptional()
  addresses?: Address[]; // Optional addresses field

  @IsOptional()
  resetPasswordToken?: string;

  @IsOptional()
  resetPasswordExpires?: Date;
}
