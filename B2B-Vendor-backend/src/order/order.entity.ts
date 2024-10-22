import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Address } from 'users/address/addresses/addresses.entity';
import { User } from 'users/user/users.entity';
import { OrderItemEntity } from './order.item.entity';
import { DeliveryType, PaymentMethod } from './order.dto'; // Import enums from DTO


@Entity('orders')
export class OrderEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => User, (user) => user.orders, { nullable: false, onDelete: 'CASCADE' })
    user!: User;  // Made non-nullable

    @ManyToOne(() => Address, (address) => address.orders, { nullable: false })
    address!: Address; // Made non-nullable

    @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order) // Add relation to OrderItemEntity
    orderItems!: OrderItemEntity[];

    @Column()
    totalPrice!: number;


    @Column({ type: 'enum', enum: DeliveryType, default: DeliveryType.FREE })
    delivery!: DeliveryType; // Delivery type, default is 'free'

    @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.CASH_ON_DELIVERY })
    paymentMethod!: PaymentMethod; // Payment method, default is 'cash_on_delivery'


    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;
    
}
// 