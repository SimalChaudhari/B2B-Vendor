import {
    Body,
    Controller,
    HttpStatus,
    Param,
    Post,
    Get,
    Put,
    Delete,
    Res,
    NotFoundException,
    HttpException,
    UseGuards,
    Req,
    UnauthorizedException,
} from '@nestjs/common';
import { OrderService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from './order.dto';
import { Order } from './order.entity';
import { Response, Request } from 'express';
import { JwtAuthGuard } from 'auth/jwt/jwt-auth.guard';


@UseGuards(JwtAuthGuard) // Protect all routes in this controller
@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Post('create')
    async create(@Body() createOrderDto: CreateOrderDto,
        @Req() request: Request,
        @Res() response: Response): Promise<Response> {

        // Check if user is authenticated
        if (!request.user) {
            throw new UnauthorizedException('User is not authenticated');
        }
        const userId = request.user.id; // Get the user ID from the authenticated request
        if (!userId) {
            throw new NotFoundException('User is not found');
        }
        try {
            const order = await this.orderService.create(createOrderDto, userId);
            return response.status(HttpStatus.CREATED).json({
                message: 'Order created successfully',
                data: order,
            });
        } catch (error: any) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get('')
    async findAll(@Res() response: Response): Promise<Response> {
        try {
            const orders = await this.orderService.findAll();
            return response.status(HttpStatus.OK).json({
                length: orders.length,
                data: orders,
            });
        } catch (error: any) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('get/:id')
    async findOne(@Param('id') id: string, @Res() response: Response): Promise<Response> {
        try {
            const order = await this.orderService.findOne(id);
            return response.status(HttpStatus.OK).json({
                data: order,
            });
        } catch (error: any) {
            throw new NotFoundException(error.message);
        }
    }

    @Put('update/:id')
    async update(
        @Param('id') id: string,
        @Body() updateOrderDto: UpdateOrderDto,
        @Res() response: Response,
        @Req() request: Request,
    ): Promise<Response> {
        // Check if user is authenticated
        if (!request.user) {
            throw new UnauthorizedException('User is not authenticated');
        }
        const userId = request.user.id; // Get the user ID from the authenticated request

        // Check if userId is valid
        if (!userId) {
            throw new NotFoundException('User ID not found in request.');
        }

        try {
            const updatedOrder = await this.orderService.update(id, updateOrderDto, userId);
            return response.status(HttpStatus.OK).json({
                message: 'Order updated successfully',
                data: updatedOrder,
            });
        } catch (error: any) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Delete('delete/:id')
    async remove(@Param('id') id: string, @Res() response: Response): Promise<Response> {
        try {
            await this.orderService.remove(id);
            return response.status(HttpStatus.OK).json({
                message: 'Order deleted successfully',
            });
        } catch (error: any) {
            throw new NotFoundException(error.message);
        }
    }
}
