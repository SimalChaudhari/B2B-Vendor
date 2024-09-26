import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferService } from './offers.service';
import { OfferController } from './offers.controller';
import { Offer } from './offer.entity';
import { Product } from '../products/product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Offer, Product])],
    providers: [OfferService],
    controllers: [OfferController],
})
export class OfferModule {}
