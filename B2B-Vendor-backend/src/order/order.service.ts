import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './order.entity';
import { User } from 'users/user/users.entity';
import { CartItemEntity } from 'cart/cart.entity';
import { CreateOrderDto } from './order.dto';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
        @InjectRepository(User)
        private readonly customerRepository: Repository<User>,
        @InjectRepository(CartItemEntity)
        private readonly cartItemRepository: Repository<CartItemEntity>,
    ) {}

    async createOrder(userId: string, createOrderDto: CreateOrderDto): Promise<OrderEntity> {
        const { customerId, paymentMethod, shippingAddress, items } = createOrderDto;

        // Get customer details
        const customer = await this.customerRepository.findOne({ where: { id: customerId } });

        if (!customer) {
            throw new NotFoundException('Customer not found');
        }

        const order = new OrderEntity();
        order.customer = customer;
        order.orderDate = new Date();
        order.totalAmount = 0; // Initialize total amount
        order.orderStatus = 'Pending'; // Set initial order status
        order.paymentMethod = paymentMethod;

        return this.orderRepository.save(order);
    }
}
