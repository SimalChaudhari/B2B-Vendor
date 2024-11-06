import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('sync_logs')
export class SyncLog {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn()
    timestamp!: Date;

    @Column({ type: 'int', default: 0 })
    attempt_count!: number;

    @Column({ type: 'varchar', length: 20 })
    status!: string; // e.g., 'SUCCESS', 'PARTIAL_SUCCESS', 'FAILURE'

}
