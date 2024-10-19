import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';

import { JwtAuthGuard } from 'auth/jwt/jwt-auth.guard';
import { Request } from 'express';
import { CreateOrderDto } from './order.dto';

@UseGuards(JwtAuthGuard) // Protect all routes in this controller
@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post('/create')
    async createOrder(@Req() req: Request, @Body() createOrderDto: CreateOrderDto) {
        const userId = req.user.id; // Get user ID from request
        return this.orderService.createOrder(userId, createOrderDto);
    }
}
