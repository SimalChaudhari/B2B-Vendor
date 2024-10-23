// cart.entity.ts
import { ItemEntity } from 'fetch-products/item.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';

@Entity('CartItems')
export class CartItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => ItemEntity, { eager: true }) // Fetch related product details
  product!: ItemEntity;

  @Column()
  quantity!: number;

  

  @Column()
  userId!: string; // Associate with the user (assuming you have users)
  price!: number;
}
