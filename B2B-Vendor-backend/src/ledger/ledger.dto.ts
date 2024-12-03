import { IsNotEmpty, IsString, IsNumber, ValidateNested, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { BillDto } from './ledger.bill.dto';

export class LedgerDto {
    @IsNotEmpty()
    @IsString()
    customerName!: string;

    @IsNumber()
    creditLimit!: number;

    @IsNumber()
    closingBalance!: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BillDto)
    bills!: BillDto[];
}


export class LedgerVoucherDto {
    @IsNotEmpty()
    @IsString()
    date!: string;
  
    @IsOptional()
    @IsString()
    ledger?: string;
  
    @IsNotEmpty()
    @IsString()
    voucherType!: string;
  
    @IsNotEmpty()
    @IsString()
    voucherNo!: string;
  
    @IsOptional()
    @IsNumber()
    debitAmount?: number;
  
    @IsOptional()
    @IsNumber()
    creditAmount?: number;
  }
  
  export class LedgerStatementDto {
    @IsNotEmpty()
    @IsString()
    party!: string;
  
    @IsArray()
    vouchers!: LedgerVoucherDto[];
  }