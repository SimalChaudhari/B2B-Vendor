import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { BillEntity } from './bill.entity';

@Entity('receivable')
export class LedgerEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  customerName!: string;

  @Column({ type: 'float', nullable: true })
  creditLimit?: number;

  @Column({ type: 'float', nullable: true })
  closingBalance?: number;

  @OneToMany(() => BillEntity, (bill) => bill.ledger, { cascade: true, eager: true })
  bills!: BillEntity[];
}


@Entity('ledger_statements')
export class LedgerStatementEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  party?: string;

  @Column({ type: 'float', nullable: true })
  openingBalance?: number;

  @Column({ type: 'float', nullable: true })
  closingBalance?: number;

  @Column({ type: 'float', nullable: true })
  totalDebitAmount?: number;

  @Column({ type: 'float', nullable: true })
  totalCreditAmount?: number;

  @OneToMany(() => LedgerVoucherEntity, (voucher) => voucher.ledgerStatement, {
    cascade: true,
    eager: true,
  })
  vouchers!: LedgerVoucherEntity[];
}

@Entity('ledger_vouchers')
export class LedgerVoucherEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  date?: string;

  @Column({ nullable: true })
  ledger?: string;

  @Column({ nullable: true })
  voucherType?: string;

  @Column({ nullable: true })
  voucherNo?: string;

  @Column({ type: 'float', nullable: true })
  debitAmount?: number;

  @Column({ type: 'float', nullable: true })
  creditAmount?: number;

  @ManyToOne(() => LedgerStatementEntity, (ledger) => ledger.vouchers, { onDelete: 'CASCADE' })
  ledgerStatement!: LedgerStatementEntity;

}
