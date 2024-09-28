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
        // Find the product and include the subcategory and category relations
        const product = await this.productRepository.findOne({
            where: { id: createOfferDto.productId },
            relations: ['subcategory', 'subcategory.category'], // Load subcategory and category
        });

        // Check if the product exists
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Create the offer and associate it with the product
        const offer = this.offerRepository.create({
            ...createOfferDto,
            product, // Attach the product with its full details
        });

        // Save the offer in the repository
        return await this.offerRepository.save(offer);
    }



    async findAll(): Promise<Offer[]> {
        return await this.offerRepository.find({
            relations: ['product', 'product.subcategory', 'product.subcategory.category'], // Include product, subcategory, and category relations
        });
    }


    async findOne(id: string): Promise<Offer> {
        const offer = await this.offerRepository.findOne({
            where: { id },
            relations: ['product', 'product.subcategory', 'product.subcategory.category'], // Include product, subcategory, and category relations
        });

        if (!offer) {
            throw new NotFoundException('Offer not found');
        }

        return offer;
    }

    async update(id: string, updateOfferDto: UpdateOfferDto): Promise<Offer> {
        // Find the offer with the product and related entities
        const offer = await this.offerRepository.findOne({
            where: { id },
            relations: ['product', 'product.subcategory', 'product.subcategory.category'], // Include product, subcategory, and category relations
        });

        // Check if the offer exists
        if (!offer) {
            throw new NotFoundException('Offer not found');
        }

        // If a new productId is provided in updateOfferDto, validate and update the product
        if (updateOfferDto.productId) {
            const product = await this.productRepository.findOne({
                where: { id: updateOfferDto.productId },
                relations: ['subcategory', 'subcategory.category'], // Load related data for the product
            });

            // Check if the new product exists
            if (!product) {
                throw new NotFoundException('Product not found');
            }

            // Assign the new product to the offer
            offer.product = product;
        }

        // Merge the other update details into the existing offer
        Object.assign(offer, updateOfferDto);

        // Save the updated offer
        const updatedOffer = await this.offerRepository.save(offer);

        // Fetch the updated offer with full product, subcategory, and category details
        const fullUpdatedOffer = await this.offerRepository.findOne({
            where: { id: updatedOffer.id },
            relations: ['product', 'product.subcategory', 'product.subcategory.category'],
        });

        // Ensure fullUpdatedOffer is not null before returning
        if (!fullUpdatedOffer) {
            throw new NotFoundException('Error fetching updated offer details');
        }

        return fullUpdatedOffer;
    }



    async delete(id: string): Promise<{ message: string }> {
        const offer = await this.findOne(id);
        if (!offer) {
            throw new NotFoundException('Offer not found');
        }
        await this.offerRepository.remove(offer);
        return new NotFoundException('Offer deleted successfully');
    }
}
