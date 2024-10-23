import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Address } from 'users/address/addresses/addresses.entity';
import { User } from 'users/user/users.entity';
import { OrderItemEntity } from './order.item.entity';

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

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;
    
}
// 