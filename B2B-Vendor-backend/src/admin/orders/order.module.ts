import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Product } from 'admin/products/products/product.entity';
import { User } from 'users/user/users.entity';
import { Address } from 'users/address/addresses/addresses.entity';
import { OrderController } from './orders.controller';
import { OrderService } from './orders.service';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'users/user/users.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, Product, User, Address]), // Add related entities like Product, User, etc.
        JwtModule.register({
            secret: process.env.JWT_SECRET, // Use your JWT secret from the .env file
            signOptions: { }, // Set your token expiration
          }),
        ],

    controllers: [OrderController],
    providers: [OrderService,UserService],
})
export class OrderModule {}
