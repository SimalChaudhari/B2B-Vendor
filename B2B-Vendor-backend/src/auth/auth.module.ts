// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { EmailService } from 'service/email/email.service';
import { User } from 'user/users.entity';
import { Address } from 'addresses/addresses.entity';
import { AddressesService } from 'addresses/addresses.service';
dotenv.config(); // Load environment variables
@Module({
  imports: [TypeOrmModule.forFeature([User,Address]),
  JwtModule.register({
    secret: process.env.JWT_SECRET, // Use your JWT secret from the .env file
    signOptions: { }, // Set your token expiration
  }),

],
  providers: [AuthService,AddressesService,EmailService],
  controllers: [AuthController],
})
export class AuthModule {}
