import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category, CategoryStatus } from './category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) { }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        // Check for existing category (case-insensitive)
        const existingCategory = await this.categoryRepository
            .createQueryBuilder('category')
            .where('LOWER(category.name) = LOWER(:name)', { name: createCategoryDto.name })
            .getOne();

        if (existingCategory) {
            throw new ConflictException(`Category with name "${createCategoryDto.name}" already exists.`);
        }
        // Create and save the new category
        const category = this.categoryRepository.create({
            ...createCategoryDto
        });
        return await this.categoryRepository.save(category);
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        const category = await this.findOne(id);

        // Check for existing category with the same name (case-insensitive)
        const existingCategory = await this.categoryRepository
            .createQueryBuilder('category')
            .where('LOWER(category.name) = LOWER(:name)', { name: updateCategoryDto.name })
            .andWhere('category.id != :id', { id }) // Exclude the current category
            .getOne();

        if (existingCategory) {
            throw new ConflictException(`Category with name "${updateCategoryDto.name}" already exists.`);
        }
        Object.assign(category, updateCategoryDto);
        return await this.categoryRepository.save(category);
    }

    async findAll(): Promise<Category[]> {
        return await this.categoryRepository.find();
    }

    async findOne(id: string): Promise<Category> {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        return category;
    }

    async delete(id: string): Promise<{ message: string }> {
        const category = await this.findOne(id);
        await this.categoryRepository.remove(category);
        return { message: 'Category deleted successfully' };
    }
}
