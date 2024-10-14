// Item.entity.ts
import { Entity, Column, PrimaryGeneratedColumn,OneToMany } from 'typeorm';

@Entity('Items')
export class ItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string; // Change to string to match UUID format

  @Column()
  itemName!: string; // This should correspond to the actual property

  @Column({ type: 'varchar', nullable: true })
  alias!: string;

  @Column({ type: 'varchar', nullable: true })
  partNo!: string;

  @Column({ type: 'varchar', nullable: true })
  description!: string;

  @Column({ type: 'varchar', nullable: true })
  group!: string;

  @Column({ type: 'varchar', nullable: true })
  subGroup1!: string;

  @Column({ type: 'varchar', nullable: true })
  subGroup2!: string;

  @Column({ type: 'varchar', nullable: true })
  baseUnit!: string;

  @Column({ type: 'varchar', nullable: true })
  alternateUnit!: string;

  @Column({ type: 'varchar', nullable: true })
  conversion!: string;

  @Column({ type: 'varchar', nullable: true })
  denominator!: number;

  @Column({ type: 'date', nullable: true })
  sellingPriceDate!: Date;

  @Column({ type: 'decimal', nullable: true })
  sellingPrice!: number;

  @Column({ type: 'varchar', nullable: true })
  gstApplicable!: string;

  @Column({ type: 'date', nullable: true })
  gstApplicableDate!: Date;

  @Column({ type: 'varchar', nullable: true })
  taxability!: string;

  @Column({ type: 'decimal', nullable: true })
  gstRate!: number;

  @Column('simple-array', { nullable: true }) // For storing product image paths
  productImages!: string[];

  @Column('simple-array', { nullable: true }) // For storing dimensional file paths
  dimensionalFiles!: string[];
}
