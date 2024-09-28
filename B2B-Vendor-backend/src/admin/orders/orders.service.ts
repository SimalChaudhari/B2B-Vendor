import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto, UpdateOrderDto } from './order.dto';
import { Order } from './order.entity';
import { UserService } from 'users/user/users.service';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        private readonly userService: UserService, // Inject UserService to check user existence

    ) { }

    async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {

        const user = await this.userService.getById(userId); // Assuming you have a method to find a user by ID
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found.`);
        }
        // Assuming CreateOrderDto has all the fields required to create an order
        const order = this.orderRepository.create(createOrderDto);
        order.userId = userId;  // Assuming user_id is the correct property name on the Address entity
        return await this.orderRepository.save(order);
    }

    async findAll(): Promise<Order[]> {
        return await this.orderRepository.find();
    }

    async findOne(id: string): Promise<Order> {
        const order = await this.orderRepository.findOne({ where: { id } });
        if (!order) {
            throw new NotFoundException('Order not found');
        }
        return order;
    }

    async update(id: string, updateOrderDto: UpdateOrderDto, userId: string): Promise<Order> {
        const order = await this.findOne(id);
        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found.`);
        }

        // Check if the user exists
        const user = await this.userService.getById(userId); // Assuming you have a method to find a user by ID
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found.`);
        }

        // Update the order
        Object.assign(order, updateOrderDto);
        return await this.orderRepository.save(order);
    }



    async remove(id: string): Promise<void> {
        const order = await this.findOne(id);
        await this.orderRepository.remove(order);
    }
}
