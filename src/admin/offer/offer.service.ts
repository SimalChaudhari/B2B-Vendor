import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Offer, OfferDocument } from './offer.schema';
import { CreateOfferDto, UpdateOfferDto } from './offer.dto';
import { Product, ProductDocument } from 'admin/products/product.schema';

@Injectable()
export class OfferService {
    constructor(@InjectModel(Offer.name) private offerModel: Model<OfferDocument>,
        @InjectModel(Product.name) private productModel: Model<ProductDocument>
    ) { }

    async create(createOfferDto: CreateOfferDto): Promise<Offer> {
        try {

            // Validate category ID
            if (createOfferDto.product) {
                const productExists = await this.productModel.exists({ _id: createOfferDto.product });
                if (!productExists) {
                    throw new NotFoundException('Product not found');
                }
            }
            const offer = new this.offerModel(createOfferDto);
            return await offer.save();
        } catch (err: unknown) {
            if (err instanceof Error) {
                throw new BadRequestException(err.message);
            }
            throw err;
        }
    }

    async findAll(): Promise<Offer[]> {
        return this.offerModel.find().populate('product').exec(); // Populate the product details
    }

    async findById(id: string): Promise<Offer> {
        const offer = await this.offerModel.findById(id).populate('product').exec();
        if (!offer) {
            throw new NotFoundException('Offer not found');
        }
        return offer;
    }
    async update(id: string, updateOfferDto: UpdateOfferDto): Promise<Offer> {
        try {
            if (updateOfferDto.product) {
                const productExists = await this.productModel.exists({ _id: updateOfferDto.product });
                if (!productExists) {
                    throw new NotFoundException('Product not found');
                }
            }
            const offer = await this.offerModel.findByIdAndUpdate(id, updateOfferDto, { new: true }).exec();
            if (!offer) {
                throw new NotFoundException('Offer not found');
            }
            return offer;
        } catch (err: unknown) {
            if (err instanceof Error) {
                throw new BadRequestException(err.message);
            }
            throw err;
        }
    }


    async remove(id: string): Promise<{ message: string }> {
        const offer = await this.offerModel.findByIdAndDelete(id).exec();
        if (!offer) {
            throw new NotFoundException('Offer not found');
        }
        return { message: 'Offer deleted successfully' };
    }
}
