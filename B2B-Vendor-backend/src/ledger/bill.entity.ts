import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { LedgerEntity } from './ledger.entity';

@Entity('bills')
export class BillEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', nullable: true })
    tallyOrdId?: string;

    @Column({ type: 'varchar', nullable: true })
    nxOrderId?: string;

    @Column({ type: 'varchar', nullable: true })
    tallyInvNo?: string;

    @Column({ type: 'date', nullable: true })
    billDate?: string;

    @Column({ type: 'float' })
    openingBalance!: number;

    @Column({ type: 'float' })
    closingBalance!: number;

    @Column({ type: 'varchar', nullable: true })
    creditPeriod?: string;

    @ManyToOne(() => LedgerEntity, (ledger) => ledger.bills, { onDelete: 'CASCADE' })
    ledger!: LedgerEntity;
}
