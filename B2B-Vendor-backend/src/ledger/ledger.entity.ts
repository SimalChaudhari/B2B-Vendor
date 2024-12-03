import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
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


@Entity('ledger_statements')
export class LedgerStatementEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  party!: string;

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

  @Column()
  date!: string;

  @Column({ nullable: true })
  ledger!: string;

  @Column()
  voucherType!: string;

  @Column()
  voucherNo!: string;

  @Column({ type: 'float', nullable: true })
  debitAmount!: number;

  @Column({ type: 'float', nullable: true })
  creditAmount!: number;

  @ManyToOne(() => LedgerStatementEntity, (ledger) => ledger.vouchers)
  ledgerStatement!: LedgerStatementEntity;
}