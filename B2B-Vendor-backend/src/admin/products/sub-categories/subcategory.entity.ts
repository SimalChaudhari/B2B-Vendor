import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Category } from '../categories/category.entity';

export enum SubcategoryStatus {
    Active = 'Active',
    Inactive = 'Inactive',
}

@Entity('subcategories')
export class Subcategory {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ type: 'enum', enum: SubcategoryStatus,default: SubcategoryStatus.Active})
    status!: SubcategoryStatus;

    @ManyToOne(() => Category, category => category.subcategories) // Link to Category
    category!: Category;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
    products: any;
}
