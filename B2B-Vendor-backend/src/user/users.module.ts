//users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { User } from './users.entity';
import { JwtModule } from '@nestjs/jwt';
import { Address } from 'addresses/addresses.entity';


@Module({
    imports: [TypeOrmModule.forFeature([User, Address]),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Use your JWT secret from the .env file
      signOptions: { }, // Set your token expiration
    }),
  ],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule {}

