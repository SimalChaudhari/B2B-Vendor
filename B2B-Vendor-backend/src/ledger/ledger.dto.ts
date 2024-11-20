import { IsNotEmpty, IsString, IsNumber, ValidateNested, IsArray } from 'class-validator';
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
