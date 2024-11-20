import { IsOptional, IsString, IsNumber } from 'class-validator';

export class BillDto {
    @IsOptional()
    @IsString()
    tallyOrdId?: string;

    @IsOptional()
    @IsString()
    nxOrderId?: string;

    @IsOptional()
    @IsString()
    tallyInvNo?: string;

    @IsOptional()
    @IsString()
    billDate?: string;

    @IsNumber()
    openingBalance!: number;

    @IsNumber()
    closingBalance!: number;

    @IsOptional()
    @IsString()
    creditPeriod?: string;
}
