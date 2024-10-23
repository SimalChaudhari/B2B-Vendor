import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './order.entity';
import { User } from 'users/user/users.entity';
import { Address } from 'users/address/addresses/addresses.entity';
import { CreateItemOrderDto, CreateOrderDto } from './order.dto';
import { ItemEntity } from 'fetch-products/item.entity';
import { OrderItemEntity } from './order.item.entity';
import { CartItemEntity } from 'cart/cart.entity';

@Injectable()
export class OrderService {
    getOrderById(orderId: string): OrderEntity | PromiseLike<OrderEntity> {
        throw new Error('Method not implemented.');
    }
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>,

        @InjectRepository(ItemEntity)
        private readonly productRepository: Repository<ItemEntity>,
        @InjectRepository(OrderItemEntity)
        private readonly orderItemRepository: Repository<OrderItemEntity>,

        @InjectRepository(CartItemEntity)
        private readonly cartRepository: Repository<CartItemEntity>,
    ) { }

    async createOrder(userId: string, createOrderDto: CreateOrderDto): Promise<OrderEntity> {
        const { addressId, totalPrice, delivery, paymentMethod } = createOrderDto;

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const address = await this.addressRepository.findOne({ where: { id: addressId } });
        if (!address) {
            throw new NotFoundException('Address not found');
        }

        const order = this.orderRepository.create({
            user,
            address,
            totalPrice,
            delivery,
            paymentMethod,
        });

        return this.orderRepository.save(order);
    }

    async getOrdersByUserId(userId: string): Promise<OrderEntity[]> {
        return this.orderRepository.find({
            where: { user: { id: userId } },
            relations: ['address', 'user', 'orderItems.product'],
        });
    }



    async deleteOrder(orderId: string): Promise<void> {
        const order = await this.orderRepository.findOne({ where: { id: orderId } });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        await this.orderRepository.remove(order);
    }

    // order item

    // Updated logic for adding items to an order
    async addItemToOrder(createItemOrderDto: CreateItemOrderDto): Promise<OrderItemEntity[]> {
        const { orderId, products } = createItemOrderDto;

        // Find the order by orderId and load relations for User and Address
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['user', 'address'], // Include relations for user and address
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        const savedOrderItems: OrderItemEntity[] = [];

        // Loop through each product in the list
        for (const productOrder of products) {
            const { productId, quantity } = productOrder;

            // Find the product by productId
            const product = await this.productRepository.findOne({ where: { id: productId } });
            if (!product) {
                throw new NotFoundException(`Product with ID ${productId} not found`);
            }

            // Create a new OrderItem entity for each product
            const orderItem = this.orderItemRepository.create({
                order, // Same order for each item
                product,
                quantity,
            });

            // Save each OrderItem in the database
            const savedOrderItem = await this.orderItemRepository.save(orderItem);
            savedOrderItems.push(savedOrderItem); // Collect saved items
            // Option 1: Delete cart items for this product after adding to the order
            await this.cartRepository.delete({ userId: order.user.id });

        }

        // Return the array of saved OrderItem entities
        return savedOrderItems;
    }


    async getAll(): Promise<OrderItemEntity[]> {
        const address = await this.orderItemRepository.find();
        return address
    }

    async getOrderItemByUserId(userId: string): Promise<OrderItemEntity[]> {
        return this.orderItemRepository.find({
            where: { order: { user: { id: userId } } },
            relations: ['order.user', 'order.address', 'order.orderItems.product'],
        });
    }



    async getOrderItemsByOrderId(orderId: string): Promise<OrderItemEntity[]> {
        return this.orderItemRepository.find({
            where: { order: { id: orderId } },
            relations: ['order.user', 'order.address', 'order.orderItems.product'],
        });
    }



    async deleteOrderItemById(orderItemId: string): Promise<{ message: string }> {
        // Find the order item by orderItemId
        const orderItem = await this.orderItemRepository.findOne({ where: { id: orderItemId } });

        if (!orderItem) {
            throw new NotFoundException('Order item not found');
        }
        // Delete the order item
        await this.orderItemRepository.delete(orderItemId);

        return { message: 'Order item deleted successfully' };
    }

}