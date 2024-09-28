import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Subcategory } from '../sub-categories/subcategory.entity';
import { Category } from '../categories/category.entity';

export enum ProductStatus {
    Active = 'Active',
    Inactive = 'Inactive',
}

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column('text')
    description!: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price!: number;

    @Column({ nullable: true })
    imageUrl?: string;

    @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.Active })
    status!: ProductStatus;

    @ManyToOne(() => Subcategory, subcategory => subcategory.products) // Link to Subcategory
    subcategory!: Subcategory;

    @Column({ default: 0 }) // Default to 0 if not specified
    stock_quantity!: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
    offers: any;
}
