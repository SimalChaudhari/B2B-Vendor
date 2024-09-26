// src/states/entities/state.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('states')
export class State {
    @PrimaryGeneratedColumn('uuid') // Use 'uuid' to generate alphanumeric IDs
    id!: string; // Unique identifier for each address.

    @Column({ unique: true })
    state_name!: string;
}
