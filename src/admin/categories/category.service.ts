import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { Category, CategoryDocument } from './category.schema';

@Injectable()
export class CategoryService {
    constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}

    async create(categoryDto: CreateCategoryDto): Promise<Category> {
        try {
            const createdCategory = new this.categoryModel(categoryDto);
            return await createdCategory.save();
        } catch (err:any) {
            throw new BadRequestException(err.message);
        }
    }

    async findAll(): Promise<Category[]> {
        return this.categoryModel.find().exec();
    }

    async getById(id: string): Promise<Category> {
        const category = await this.categoryModel.findById(id).exec();
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        return category;
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        const category = await this.getById(id);
        Object.assign(category, updateCategoryDto);
        return category.save();
    }

    async remove(id: string): Promise<{ message: string }> {
        const category = await this.categoryModel.findByIdAndDelete(id).exec();
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        return { message: 'Category deleted successfully' };
    }
}
