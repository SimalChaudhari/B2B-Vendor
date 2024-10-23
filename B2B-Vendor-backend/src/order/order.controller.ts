import { Controller, Post, Get, Body, Req, UseGuards, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { OrderService } from './order.service';

import { JwtAuthGuard } from 'auth/jwt/jwt-auth.guard'; // Adjust the import path
import { Request, Response } from 'express';
import { CreateItemOrderDto, CreateOrderDto } from './order.dto';
import { OrderEntity } from './order.entity';
import { OrderItemEntity } from './order.item.entity';
import { isAdmin } from 'utils/auth.utils';
import { RolesGuard } from 'auth/jwt/roles.guard';

@UseGuards(JwtAuthGuard,RolesGuard)
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
        const user = req.user;
        const userRole = user?.role;
          // Admin users get all orders
        if (isAdmin(userRole)) {
            return this.orderService.getAllOrders(); // Ensure service method exists
        }
        // Regular users get their own orders
        return this.orderService.getOrdersByUserId(user.id);
    }

    @Get(':orderId')
    async getOrderById(@Param('orderId') orderId: string): Promise<OrderEntity | null> {
        return this.orderService.getOrderById(orderId);
    }

    @Get(':id')
    async findOne(@Param('orderId') orderId: string, @Res() response: Response) {
        const result = await this.orderService.getOrderById(orderId);
        return response.status(HttpStatus.OK).json({
            data: result,
        });
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

    @Delete('item-order/:orderItemId')
    async deleteOrderItemById(@Param('orderItemId') orderItemId: string): Promise<{ message: string }> {
        return this.orderService.deleteOrderItemById(orderItemId);
    }

}
