import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum SyncLogStatus {
    SUCCESS = 'success',
    FAIL = 'fail',
}

@Entity('sync_logs')
export class SyncLogEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 50 })
    sync_type!: string; // 'orders', 'products', etc.

    @Column({ type: 'int', default: 0 })
    success_count!: number;

    @Column({ type: 'int', default: 0 })
    failed_count!: number;

    @Column({ type: 'int', default: 0 })
    total_count!: number;

    @Column({ type: 'enum', enum: SyncLogStatus })
    status!: SyncLogStatus; // 'success' or 'fail'

    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date; // Auto-generated timestamp
}
