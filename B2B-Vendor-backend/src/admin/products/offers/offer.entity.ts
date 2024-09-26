import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Product } from '../products/product.entity';

export enum OfferStatus {
    Active = 'Active',
    Inactive = 'Inactive',
}

export enum DiscountType {
    Percentage = 'Percentage',
    Fixed = 'Fixed',
}

@Entity('offers')
export class Offer {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Product, product => product.offers)
    product!: Product;

    @Column({
        type: 'enum',
        enum: DiscountType,
    })
    discountType!: DiscountType;

    @Column('decimal', { precision: 10, scale: 2 })
    discountValue!: number;

    @Column({ type: 'timestamp' })
    startDate!: Date;

    @Column({ type: 'timestamp' })
    endDate!: Date;

    @Column({
        type: 'enum',
        enum: OfferStatus,
        default: OfferStatus.Active,
    })
    status!: OfferStatus;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
}
