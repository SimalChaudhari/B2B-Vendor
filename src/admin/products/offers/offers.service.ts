import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer, OfferStatus } from './offer.entity';
import { CreateOfferDto, UpdateOfferDto } from './offer.dto';
import { Product } from '../products/product.entity';

@Injectable()
export class OfferService {
    constructor(
        @InjectRepository(Offer)
        private offerRepository: Repository<Offer>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) { }

    async create(createOfferDto: CreateOfferDto): Promise<Offer> {
        const product = await this.productRepository.findOne({
            where: { id: createOfferDto.productId }, // Use where to specify conditions
        });
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        const offer = this.offerRepository.create({
            ...createOfferDto,
            status: createOfferDto.status || OfferStatus.Active,
            product,
        });
        return await this.offerRepository.save(offer);
    }


    async findAll(): Promise<Offer[]> {
        return await this.offerRepository.find({ relations: ['product'] });
    }

    async findOne(id: string): Promise<Offer> {
        const offer = await this.offerRepository.findOne({ where: { id }, relations: ['product'] });
        if (!offer) {
            throw new NotFoundException('Offer not found');
        }
        return offer;
    }

    async update(id: string, updateOfferDto: UpdateOfferDto): Promise<Offer> {
        const offer = await this.findOne(id);
        Object.assign(offer, updateOfferDto);
        return await this.offerRepository.save(offer);
    }

    async delete(id: string): Promise<{ message: string }> {
        const offer = await this.findOne(id);
        await this.offerRepository.remove(offer);
        return { message: 'Offer deleted successfully' };
    }
}
