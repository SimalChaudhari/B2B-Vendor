import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { OrderItemEntity } from './order.item.entity';
import { DeliveryType } from './order.dto'; // Import enums from DTO
import { User } from 'user/users.entity';
import { Address } from 'addresses/addresses.entity';

export enum OrderStatus {
    PENDING = 'pending',
    SUCCESS = 'completed',
    Cancelled = 'cancelled',

}

@Entity('orders')
export class OrderEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    orderNo!: string;

    @ManyToOne(() => User, (user) => user.orders, { nullable: false, onDelete: 'CASCADE' })
    user!: User;  // Made non-nullable

    @ManyToOne(() => Address, (address) => address.orders, { nullable: false })
    address!: Address; // Made non-nullable

    @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order) // Add relation to OrderItemEntity
    orderItems!: OrderItemEntity[];

    @Column()
    totalPrice!: number;

    @Column()
    totalQuantity!: number;

    @Column('float', { default: 0 }) // Use 'float' or 'decimal' for fractional values
    discount!: number; // Ensure discount defaults to 0 if not provided

    @Column() // Set default value for discount
    finalAmount!: number; // Ensure discount defaults to 0 if not provided

    @Column({ type: 'enum', enum: DeliveryType, default: DeliveryType.transportation })
    delivery!: DeliveryType; // Delivery type, default is 'free'

    // Add status column with enum and default value
    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
    status!: OrderStatus; // Order status, default is 'pending'

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

}
// 