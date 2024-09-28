import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductStatus } from './product.entity';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { Subcategory } from '../sub-categories/subcategory.entity';
import { Category } from '../categories/category.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(Subcategory)
        private subcategoryRepository: Repository<Subcategory>,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) { }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        // Ensure that subcategoryId is provided
        if (!createProductDto.subcategoryId) {
            throw new BadRequestException('Subcategory ID is required');
        }
    
        // Fetch the subcategory and its associated category
        const subcategory = await this.subcategoryRepository.findOne({
            where: { id: createProductDto.subcategoryId },
            relations: ['category']
        });
    
        // Check if the subcategory exists
        if (!subcategory) {
            throw new NotFoundException('Subcategory not found');
        }
    
        // Create the product with the associated subcategory
        const product = this.productRepository.create({
            ...createProductDto,
            status: createProductDto.status || ProductStatus.Active,
            subcategory, // Associate the subcategory with the product
        });
    
        // Save the product in the repository
        return await this.productRepository.save(product);
    }
    

    async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id }, relations: ['subcategory', 'subcategory.category'] });
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        let subcategory: Subcategory | null = null;
        // Check if subcategoryId is provided
        if (updateProductDto.subcategoryId) {
            subcategory = await this.subcategoryRepository.findOne({
                where: { id: updateProductDto.subcategoryId },
                relations: ['category']
            });

            if (!subcategory) {
                throw new NotFoundException('Subcategory not found');
            }
        }


        // Update product fields
        Object.assign(product, {
            ...updateProductDto,
            status: updateProductDto.status || product.status,
            ...(subcategory ? { subcategory } : {}),
        });

        return await this.productRepository.save(product);
    }

    async findAll(): Promise<Product[]> {
        return await this.productRepository.find({ relations: ['subcategory', 'subcategory.category'] });
    }

    async findOne(id: string): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id }, relations: ['subcategory', 'subcategory.category'] });
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return product;
    }

    async delete(id: string): Promise<{ message: string }> {
        const product = await this.findOne(id);
        await this.productRepository.remove(product);
        return { message: 'Product deleted successfully' };
    }
}
