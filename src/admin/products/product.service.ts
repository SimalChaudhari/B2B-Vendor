// product.service.ts
import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { Product, ProductDocument } from './product.schema';
import { Category, CategoryDocument } from 'admin/categories/category.schema';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
        @InjectModel(Category.name) private categoryModel: Model<CategoryDocument> // Inject Category model
    ) { }
    async create(productDto: CreateProductDto): Promise<{ product: Product, message: string }> {
        try {
            // Validate category ID
            if (productDto.category) {
                const categoryExists = await this.categoryModel.exists({ _id: productDto.category });
                if (!categoryExists) {
                    throw new BadRequestException('Invalid category ID');
                }
            }


            const createdProduct = new this.productModel(productDto);
            const savedProduct = await createdProduct.save();
            return {
                message: 'Product created successfully',
                product: savedProduct,
            };
        } catch (err: unknown) {
            if (err instanceof Error) {
                throw new BadRequestException(err.message);
            }
            throw err;
        }
    }

    async findAll(): Promise<Product[]> {
        try {
            return await this.productModel.find().populate('category').exec(); // Populate category details
        } catch (error) {
            throw new InternalServerErrorException('Error fetching products');
        }
    }


    async getById(id: string): Promise<Product> {
        try {
            const product = await this.productModel.findById(id).populate('category').exec(); // Populate category details
            if (!product) {
                throw new NotFoundException('Product not found');
            }
            return product;
        } catch (err: unknown) {
            if (err instanceof Error) {
                throw new BadRequestException(err.message);
            }
            throw err;
        }
    }

    async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
        try {

            // Validate category ID
            if (updateProductDto.category) {
                const categoryExists = await this.categoryModel.exists({ _id: updateProductDto.category });
                if (!categoryExists) {
                    throw new BadRequestException('Invalid category ID');
                }
            }

            const product = await this.getById(id);
            Object.assign(product, updateProductDto);
            return await product.save();

        } catch (err: unknown) {
            if (err instanceof Error) {
                throw new BadRequestException(err.message);
            }
            throw err;
        }
    }


    async remove(id: string): Promise<{ message: string }> {
        try {
            const product = await this.productModel.findByIdAndDelete(id).exec();
            if (!product) {
                throw new NotFoundException('Product not found');
            }
            return { message: 'Product deleted successfully' };
        } catch (err: unknown) {
            if (err instanceof Error) {
                throw new BadRequestException(err.message);
            }
            throw err;
        }
    }
}
