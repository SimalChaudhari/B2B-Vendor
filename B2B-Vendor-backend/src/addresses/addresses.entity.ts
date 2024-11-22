import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { OrderEntity } from 'order/order.entity';
import { User } from 'user/users.entity';

@Entity('addresses')
export class Address {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 255 })
    mobile!: string;

    @Column({ type: 'varchar', length: 255 })
    street_address!: string;

    // @Column({ type: 'varchar', length: 255 })
    // city!: string;

    @Column({ type: 'varchar', length: 255 })
    state!: string;

    @Column({ type: 'varchar', length: 10 })
    zip_code!: string;

    @Column({ type: 'varchar', length: 100 })
    country!: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @ManyToOne(() => User, (user) => user.addresses, { nullable: false, onDelete: 'CASCADE' })
    user!: User; // Made non-nullable

    @OneToMany(() => OrderEntity, (order) => order.address)
    orders?: OrderEntity[]; // This can remain optional
}
