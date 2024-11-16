// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { User } from 'users/user/users.entity';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

import * as dotenv from 'dotenv';
import { AddressesService } from 'users/address/addresses/addresses.service';
import { Address } from 'users/address/addresses/addresses.entity';
import { EmailService } from 'service/email/email.service';

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
