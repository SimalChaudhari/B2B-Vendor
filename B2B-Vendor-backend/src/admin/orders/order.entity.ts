import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    userId!: string;

    @Column({ nullable: true })
    awpNumber!: string;

    @Column({ nullable: true })
    shiprocketData!: string;

    @Column({ type: 'enum', enum: ['Pending', 'Completed', 'Cancelled', 'Shipped'], default: 'Pending' })
    status!: 'Pending' | 'Completed' | 'Cancelled' | 'Shipped';

    @Column('decimal', { precision: 10, scale: 2 })
    totalAmount!: number;

    @Column()
    shippingAddressId!: number;

    @Column()
    billingAddressId!: number;

    @Column({ type: 'varchar', length: 50 })
    paymentMethod!: string;

    @CreateDateColumn()
    orderDate!: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
