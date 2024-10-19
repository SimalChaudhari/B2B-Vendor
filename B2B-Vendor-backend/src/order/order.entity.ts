import { CartItemEntity } from 'cart/cart.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'users/user/users.entity';

@Entity('orders')
export class OrderEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'customer_id' })
    customer!: User;

    @Column()
    orderDate!: Date;

    @Column()
    totalAmount!: number;

    @Column()
    orderStatus!: string;

    @Column()
    paymentMethod!: string;

    @Column()
    shippingAddress?: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;

    @ManyToOne(() => CartItemEntity, { eager: true })
    @JoinColumn({ name: 'cart_item_id' })
    cartItems!: CartItemEntity[];
}
