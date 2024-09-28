import { IsNotEmpty, IsEnum, IsDecimal, IsDateString, IsOptional } from 'class-validator';
import { DiscountType, OfferStatus } from './offer.entity';

export class CreateOfferDto {
    @IsNotEmpty()
    productId!: string; // Link to product

    @IsNotEmpty()
    @IsEnum(DiscountType)
    discountType!: DiscountType;

    @IsNotEmpty()
    @IsDecimal()
    discountValue!: number;

    @IsNotEmpty()
    @IsDateString()
    startDate!: string;

    @IsNotEmpty()
    @IsDateString()
    endDate!: string;

    @IsEnum(OfferStatus)
    status?: OfferStatus;
}

export class UpdateOfferDto {
    @IsEnum(DiscountType)
    discountType?: DiscountType;

    @IsDecimal()
    discountValue?: number;

    @IsDateString()
    startDate?: string;

    @IsDateString()
    endDate?: string;

    @IsEnum(OfferStatus)
    status?: OfferStatus;

    @IsOptional()
    productId?: string;
}
