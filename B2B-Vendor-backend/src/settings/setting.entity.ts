// src/faq/entities/faq.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum FAQStatus {
    Active = 'Active',
    Inactive = 'Inactive',
}


@Entity('faqs')
export class Faq {
    @PrimaryGeneratedColumn('uuid') // Use UUID for unique ID
    id!: string;

    @Column()
    question!: string;

    @Column()
    answer!: string;

    @Column({type: 'enum',enum: FAQStatus,default: FAQStatus.Active})
    status!: FAQStatus; // Status field

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}

@Entity('logos')
export class Logo {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    logoImage!: string; // This will hold the URL/path to the logo image

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
