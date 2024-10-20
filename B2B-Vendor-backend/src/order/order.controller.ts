import { Controller, Post, Get, Body, Req, UseGuards, Param, Delete } from '@nestjs/common';
import { OrderService } from './order.service';

import { JwtAuthGuard } from 'auth/jwt/jwt-auth.guard'; // Adjust the import path
import { Request } from 'express';
import { CreateItemOrderDto, CreateOrderDto } from './order.dto';
import { OrderEntity } from './order.entity';
import { OrderItemEntity } from './order.item.entity';

@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Post('generate')
    async createOrder(@Req() req: Request, @Body() createOrderDto: CreateOrderDto) {
        const userId = req.user.id; // Assume user is authenticated
        return this.orderService.createOrder(userId, createOrderDto);
    }

    @Get('get')
    async getOrders(@Req() req: Request): Promise<OrderEntity[]> {
        const userId = req.user.id; // Assume user is authenticated
        return this.orderService.getOrdersByUserId(userId);
    }

    @Get(':orderId')
    async getOrderById(@Param('orderId') orderId: string): Promise<OrderEntity> {
        return this.orderService.getOrderById(orderId);
    }

    @Delete('delete/:orderId')
    async deleteOrder(@Param('orderId') orderId: string): Promise<{ message: string }> {
        await this.orderService.deleteOrder(orderId);
        return { message: 'order has been deleted' };  // Return a success message
    }

    // order item
    @Post('add-items')
    async addItemsToOrder(@Body() createItemOrderDto: CreateItemOrderDto): Promise<OrderItemEntity[]> {
        return this.orderService.addItemToOrder(createItemOrderDto);
    }


    @Get('items-order/:orderId')
    async getOrderItemsByOrderId(@Param('orderId') orderId: string): Promise<OrderItemEntity[]> {
        return this.orderService.getOrderItemsByOrderId(orderId);
    }

    @Delete('item-order/:orderItemId')
    async deleteOrderItemById(@Param('orderItemId') orderItemId: string): Promise<{ message: string }> {
        return this.orderService.deleteOrderItemById(orderItemId);
    }

}
