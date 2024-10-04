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


@Entity('privacy_policies')
export class PrivacyPolicy {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('text')
    content!: string; // The content of the privacy policy

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}


@Entity('terms_conditions')
export class TermsConditions {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('text')
    content!: string; // The content of the terms and conditions

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}

@Entity('contact_us')
export class ContactUs {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string; // Sender's name

    @Column()
    email!: string; // Sender's email address

    @Column('text')
    message!: string; // The message sent by the user

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}