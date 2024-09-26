import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Subcategory } from '../sub-categories/subcategory.entity';

export enum CategoryStatus {
    Active = 'Active',
    Inactive = 'Inactive',
}

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column({ nullable: true })
    description?: string;

    @Column({
        type: 'enum',
        enum: CategoryStatus,
        default: CategoryStatus.Active,
    })
    status!: CategoryStatus; // Status field

    @OneToMany(() => Subcategory, subcategory => subcategory.category)
    subcategories!: Subcategory[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
}
