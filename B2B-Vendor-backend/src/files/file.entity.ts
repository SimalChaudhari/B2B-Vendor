// // src/files/file.entity.ts
// import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
// import { ItemEntity } from 'fetch-products/item.entity'; // Adjust the import path accordingly

// @Entity('files')
// export class File {
//   @PrimaryGeneratedColumn('uuid')
//   id!: string;

//   @Column()
//   itemId!: string;

//   @Column({ nullable: true })
//   productImage?: string; // Reference for product images

//   @Column({ nullable: true })
//   dimensionalFile?: string; // Reference for dimensional files

  // @ManyToOne(() => ItemEntity, (item) => item.files)
  // item!: ItemEntity; // Relationship with Item
// }/
// 