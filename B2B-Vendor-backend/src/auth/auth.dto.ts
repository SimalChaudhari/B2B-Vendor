// src/auth/auth.dto.ts
import { IsEmail, IsMobilePhone, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsMobilePhone()
  @IsNotEmpty()
  mobile!: string;

  @IsString()
  @IsOptional()
  otp?: string; // OTP for verification

  @IsString()
  @IsOptional()
  contact?: string; // New field for either email or mobile
}
