// auth.dto.ts
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

  @IsMobilePhone()
  mobile!: number;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole; // Optional role field

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus; // Optional status field

  @IsOptional()
  addresses?: Address[]; // Optional addresses field

  @IsOptional()
  otp?: string; // Optional addresses field

  @IsOptional()
  otpExpires?: Date; // Optional addresses field


}
