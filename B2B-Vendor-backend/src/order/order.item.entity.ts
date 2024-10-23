import { ItemEntity } from 'fetch-products/item.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Address } from 'users/address/addresses/addresses.entity';
import { User } from 'users/user/users.entity';
import { OrderEntity } from './order.entity';

export enum OrderStatus {
    PENDING = 'pending',
    SUCCESS = 'success',
    REFUSED = 'refused',
}



@Entity('ordersItem')
export class OrderItemEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => OrderEntity, (order) => order.orderItems, { nullable: false, onDelete: 'CASCADE' })
    order!: OrderEntity;  // Link to the order

    @ManyToOne(() => ItemEntity, (product) => product.orderItem, { nullable: false, onDelete: 'CASCADE' })
    product!: ItemEntity;  // Changed user? to user! to enforce non-nullable constraint

    @Column()
    quantity!: number;

    // Add status column with enum and default value
    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
    status!: OrderStatus; // Order status, default is 'pending'

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;
}
