import { IsNotEmpty, IsNumber, IsDate, IsMongoId } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';


export class CreateOfferDto {
  @IsNotEmpty()
  offerName?: string;

  @IsNumber()
  discountPercentage?: number;

  @IsDate()
  startDate?: Date;

  @IsDate()
  endDate?: Date;

  @IsMongoId()
  product?: string; // Product ID reference
}


export class UpdateOfferDto extends PartialType(CreateOfferDto) {}
