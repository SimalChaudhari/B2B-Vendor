import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderEntity } from './order.entity';
import { User } from 'users/user/users.entity';
import { CartItemEntity } from 'cart/cart.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([OrderEntity, User, CartItemEntity]),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { /* options */ },
        }),
    ],
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule {}

