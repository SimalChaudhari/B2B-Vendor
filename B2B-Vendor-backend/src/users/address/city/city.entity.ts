// src/cities/entities/city.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { State } from '../state/state.entity';

@Entity('cities')
export class City {
    @PrimaryGeneratedColumn('uuid') // Use 'uuid' to generate alphanumeric IDs
    id!: string; // Unique identifier for each address.

    @Column()
    city_name!: string;

    @ManyToOne(() => State, (state) => state.id)
    state!: State;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

}
