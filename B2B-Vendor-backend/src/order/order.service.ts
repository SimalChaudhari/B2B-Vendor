import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity, OrderStatus } from './order.entity';
import { User } from 'users/user/users.entity';
import { Address } from 'users/address/addresses/addresses.entity';
import { CreateItemOrderDto, CreateOrderDto } from './order.dto';
import { ItemEntity } from 'fetch-products/item.entity';
import { OrderItemEntity } from './order.item.entity';
import { CartItemEntity } from 'cart/cart.entity';
import { DataSource, Repository } from 'typeorm';
import { generateInvoiceXML } from 'tally/invoice-xml-generator';
import axios from 'axios';
import { Invoice, InvoiceStatus } from 'invoice/invoice.entity';

@Injectable()
export class OrderService {

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

        @InjectRepository(Invoice)
        private readonly invoiceRepository: Repository<Invoice>,
    ) { }

    async getAllOrders(): Promise<OrderEntity[]> {
        return this.orderRepository.find({
            relations: ['address', 'user', 'orderItems.product'],
        });
    }

    async getMonthlyProductCounts(): Promise<Array<{ month: string; status: string; count: number }>> {
        // Fetch monthly data and group by month and status
        const monthlyData = await this.orderRepository
            .createQueryBuilder('order')
            .select("TO_CHAR(order.createdAt, 'YYYY-MM')", 'month')
            .addSelect('order.status', 'status')
            .addSelect('COUNT(order.id)', 'count')
            .where('order.status != :status', { status: OrderStatus.Cancelled }) // Exclude canceled orders
            .groupBy("TO_CHAR(order.createdAt, 'YYYY-MM'), order.status")
            .orderBy('month', 'ASC')
            .getRawMany();

        // Ensure the count is returned as a number
        return monthlyData.map((data) => ({
            month: data.month,
            status: data.status,
            count: Number(data.count),
        }));
    }


    async findAllCompleted(): Promise<OrderEntity[]> {
        return this.orderRepository.find({ where: { status: OrderStatus.SUCCESS } });
    }

    async createOrder(userId: string, createOrderDto: CreateOrderDto): Promise<OrderEntity> {
        const { addressId, totalPrice, totalQuantity, delivery, paymentMethod } = createOrderDto;

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const address = await this.addressRepository.findOne({ where: { id: addressId } });
        if (!address) {
            throw new NotFoundException('Address not found');
        }

        // Generate a unique order number (e.g., #12345)
        const orderNo = await this.generateUniqueOrderNumber();

        const order = this.orderRepository.create({
            orderNo,
            user,
            address,
            totalPrice,
            totalQuantity,
            delivery,
            paymentMethod,
        });

        return this.orderRepository.save(order);
    }
    // Helper function to generate a unique order number
    private async generateUniqueOrderNumber(): Promise<string> {
        while (true) {
            // Generate a random number between 10000 and 99999
            const randomNo = Math.floor(10000 + Math.random() * 90000);
            const orderNo = `#${randomNo}`;

            // Check if the generated order number already exists in the database
            const existingOrder = await this.orderRepository.findOne({ where: { orderNo } });

            if (!existingOrder) {
                return orderNo; // Return the order number if unique
            }
        }
    }


    async getOrdersByUserId(userId: string): Promise<any> {

        const orders = await this.orderRepository.find({
            where: { user: { id: userId } },
            relations: ['address', 'user', 'orderItems.product'],
        });

        // Aggregate counts of orders by status using QueryBuilder
        const statusCounts = await this.orderRepository
            .createQueryBuilder('order')
            .select('order.status', 'status')
            .addSelect('COUNT(order.id)', 'count')
            .where('order.userId = :userId', { userId })
            .groupBy('order.status')
            .getRawMany();

        // Convert query result into an easy-to-use object
        const statusSummary = statusCounts.reduce((acc, { status, count }) => {
            acc[status] = parseInt(count, 10);
            return acc;
        }, {});

        const totalOrders = orders.length;

        // Fetch monthly data and group by month and status
        const monthlyData = await this.orderRepository
            .createQueryBuilder('order')
            .select("TO_CHAR(order.createdAt, 'YYYY-MM')", 'month')
            .addSelect('order.status', 'status')
            .addSelect('COUNT(order.id)', 'count')
            .where('order.userId = :userId', { userId })
            .groupBy("TO_CHAR(order.createdAt, 'YYYY-MM'), order.status")
            .orderBy('month', 'ASC')
            .getRawMany();

        // Transform the monthly data into an array format
        const monthlySummary = this.transformMonthlyData(monthlyData);

        return {
            orders,
            statusSummary: {
                totalOrders,
                pending: statusSummary[OrderStatus.PENDING] || 0,
                completed: statusSummary[OrderStatus.SUCCESS] || 0,
                cancelled: statusSummary[OrderStatus.Cancelled] || 0,
            },
            monthlyData: monthlySummary, // Include the monthly summary here
        };
    }


    private transformMonthlyData(
        data: { month: string; status: string; count: string }[]
    ): { month: string; total: number; pending: number; completed: number; cancelled: number }[] {
        // Define the type for the summary object
        const summary: Record<
            string,
            { month: string; total: number; pending: number; completed: number; cancelled: number }
        > = {};

        // Helper function to map database statuses to object keys
        const mapStatus = (status: string): 'pending' | 'completed' | 'cancelled' => {
            switch (status) {
                case OrderStatus.PENDING:
                    return 'pending';
                case OrderStatus.SUCCESS:
                    return 'completed';
                case OrderStatus.Cancelled:
                    return 'cancelled';
                default:
                    throw new Error(`Unknown status: ${status}`);
            }
        };

        // Group data by month and accumulate status counts and total orders
        data.forEach(({ month, status, count }) => {
            if (!summary[month]) {
                summary[month] = { month, total: 0, pending: 0, completed: 0, cancelled: 0 };
            }
            const key = mapStatus(status);
            const parsedCount = parseInt(count, 10);

            // Accumulate counts for each status and the total
            summary[month][key] += parsedCount;
            summary[month].total += parsedCount;
        });

        // Convert the summary object into an array
        return Object.values(summary);
    }





    async getOrderById(orderId: string): Promise<OrderEntity> {
        try {
            const order = await this.orderRepository.findOne({
                where: { id: orderId },
                relations: ['address', 'user', 'orderItems.product'],
            });
            if (!order) {
                throw new NotFoundException(`order  not found`);
            }
            return order;
        } catch (error: any) {
            throw error
        }
    }



    async deleteOrder(orderId: string): Promise<void> {
        const order = await this.orderRepository.findOne({ where: { id: orderId } });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        await this.orderRepository.remove(order);
    }

    // order item

    async addItemToOrder(createItemOrderDto: CreateItemOrderDto): Promise<OrderItemEntity[]> {
        const { orderId, products } = createItemOrderDto;

        // Find the order by orderId and load relations for User and Address
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['user', 'address'],
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        const savedOrderItems: OrderItemEntity[] = [];

        // Loop through each product in the list and add them to the order
        for (const productOrder of products) {
            const { productId, quantity } = productOrder;

            // Find the product by productId
            const product = await this.productRepository.findOne({ where: { id: productId } });
            if (!product) {
                throw new NotFoundException(`Product with ID ${productId} not found`);
            }

            // Create and save each OrderItem
            const orderItem = this.orderItemRepository.create({
                order,
                product,
                quantity,
            });
            const savedOrderItem = await this.orderItemRepository.save(orderItem);
            savedOrderItems.push(savedOrderItem);
        }

        // Clear the cart for this user once all items are added
        await this.cartRepository.delete({ userId: order.user.id });
        // Attempt to post the invoice to Tally
        try {
            await this.postToTally(order, savedOrderItems);
            console.log('Invoice posted to Tally successfully');
        } catch (error) {
            console.error('Failed to post invoice to Tally:', error);
            // Log error and continue without blocking order creation
        }

        return savedOrderItems;
    }

    async postToTally(order: OrderEntity, savedOrderItems: OrderItemEntity[]): Promise<void> {
        const xml = generateInvoiceXML(order, savedOrderItems);

        try {
            const response = await axios.post('http://localhost:9000', xml, {
                headers: {
                    'Content-Type': 'application/xml',
                },
            });
            console.log('Tally Response:', response.data);

        } catch (error) {
            console.error('Error posting to Tally:', error);

            // Save the unsent invoice in the database for retry
            const unsentInvoice = new Invoice();
            unsentInvoice.orderId = order.id;
            unsentInvoice.xmlContent = xml;
            unsentInvoice.userId = order?.user?.id;
            unsentInvoice.status = InvoiceStatus.PENDING;
            await this.invoiceRepository.save(unsentInvoice);

            throw new Error('Failed to post invoice to Tally. It will be retried later.');
        }
    }

    async getAll(): Promise<OrderItemEntity[]> {
        const address = await this.orderItemRepository.find();
        return address
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