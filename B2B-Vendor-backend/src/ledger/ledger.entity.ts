import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BillEntity } from './bill.entity';

@Entity('ledgers')
export class LedgerEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar' })
    customerName!: string;

    @Column({ type: 'float' })
    creditLimit!: number;

    @Column({ type: 'float' })
    closingBalance!: number;

    @OneToMany(() => BillEntity, (bill) => bill.ledger, { cascade: true, eager: true })
    bills!: BillEntity[];
}
