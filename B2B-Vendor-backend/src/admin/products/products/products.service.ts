import { Injectable, NotFoundException } from '@nestjs/common';
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
        let subcategory: Subcategory | null = null;
        let category: Category | null = null;

        // Check if subcategoryId is provided
        if (createProductDto.subcategoryId) {
            subcategory = await this.subcategoryRepository.findOne({
                where: { id: createProductDto.subcategoryId },
                relations: ['category']
            });

            if (!subcategory) {
                throw new NotFoundException('Subcategory not found');
            }
        }

        // Check if categoryId is provided and no subcategory found
        if (!subcategory && createProductDto.categoryId) {
            category = await this.categoryRepository.findOne({ where: { id: createProductDto.categoryId } });

            if (!category) {
                throw new NotFoundException('Category not found');
            }
        }

        const product = this.productRepository.create({
            ...createProductDto,
            status: createProductDto.status || ProductStatus.Active,
            ...(subcategory ? { subcategory } : category ? { category } : {}),
        });

        return await this.productRepository.save(product);
    }

    async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id }, relations: ['subcategory', 'subcategory.category'] });
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        let subcategory: Subcategory | null = null;
        let category: Category | null = null;

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

        // Check if categoryId is provided and no subcategory found
        if (!subcategory && updateProductDto.categoryId) {
            category = await this.categoryRepository.findOne({ where: { id: updateProductDto.categoryId } });

            if (!category) {
                throw new NotFoundException('Category not found');
            }
        }

        // Update product fields
        Object.assign(product, {
            ...updateProductDto,
            status: updateProductDto.status || product.status,
            ...(subcategory ? { subcategory } : category ? { category } : {}),
        });

        return await this.productRepository.save(product);
    }

    async findAll(): Promise<Product[]> {
        return await this.productRepository.find({ relations: ['subcategory', 'subcategory.category', 'category'] });
    }

    async findOne(id: string): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id }, relations: ['subcategory', 'subcategory.category', 'category'] });
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
