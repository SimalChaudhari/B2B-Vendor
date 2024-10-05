// Item.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
  remarks!: string;

  @Column({ type: 'varchar', nullable: true })
  group!: string;

  @Column({ type: 'varchar', nullable: true })
  category!: string;

  @Column({ type: 'varchar', nullable: true })
  baseUnit!: string;

  @Column({ type: 'varchar', nullable: true })
  alternateUnit!: string;

  @Column({ type: 'varchar', nullable: true })
  isBatchWiseOn!: string;

  @Column({ type: 'varchar', nullable: true })
  hasMfgDate!: string;

  @Column({ type: 'varchar', nullable: true })
  hasExpiryDate!: string;

  @Column({ nullable: true, type: 'varchar' })
  costPriceDate!: string;

  @Column({ nullable: true, type: 'varchar' })
  costPrice!: string;

  @Column({ nullable: true, type: 'varchar' })
  sellingPriceDate!: string;

  @Column({ nullable: true, type: 'varchar' })
  sellingPrice!: string;

  @Column({ type: 'varchar', nullable: true })
  gstApplicable!: string;

  @Column({ nullable: true, type: 'varchar' })
  gstApplicableDate!: string;

  @Column({ nullable: true })
  gstRate!: string;
  
  @Column({ nullable: true, type: 'varchar' })
  mrpDate!: string;
  
  @Column({ nullable: true, type: 'varchar' })
  mrpRate!: string;

  // Add other fields based on the XML structure
}
