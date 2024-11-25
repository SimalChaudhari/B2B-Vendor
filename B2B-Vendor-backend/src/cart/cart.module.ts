// cart.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItemEntity } from './cart.entity';

import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ItemEntity } from './../fetch-products/item.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([CartItemEntity, ItemEntity]),
  JwtModule.register({
    secret: process.env.JWT_SECRET, // Use your JWT secret from the .env file
    signOptions: { }, // Set your token expiration
  }),
],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
