import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subcategory, SubcategoryStatus } from './subcategory.entity';
import { CreateSubcategoryDto, UpdateSubcategoryDto } from './subcategory.dto';
import { Category } from '../categories/category.entity';

@Injectable()
export class SubcategoryService {
    constructor(
        @InjectRepository(Subcategory)
        private subcategoryRepository: Repository<Subcategory>,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) {}

    async create(createSubcategoryDto: CreateSubcategoryDto): Promise<Subcategory> {
        const category = await this.categoryRepository.findOne({ where: { id: createSubcategoryDto.categoryId } });
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        const subcategory = this.subcategoryRepository.create({
            ...createSubcategoryDto,
            status: createSubcategoryDto.status || SubcategoryStatus.Active, // Default to Active
            category,
        });
        return await this.subcategoryRepository.save(subcategory);
    }

    async update(id: string, updateSubcategoryDto: UpdateSubcategoryDto): Promise<Subcategory> {
        const subcategory = await this.findOne(id);
        Object.assign(subcategory, updateSubcategoryDto);
        return await this.subcategoryRepository.save(subcategory);
    }

    async findAll(): Promise<Subcategory[]> {
        return await this.subcategoryRepository.find({ relations: ['category'] }); // Include category relation
    }

    async findOne(id: string): Promise<Subcategory> {
        const subcategory = await this.subcategoryRepository.findOne({ where: { id }, relations: ['category'] });
        if (!subcategory) {
            throw new NotFoundException('Subcategory not found');
        }
        return subcategory;
    }

    async delete(id: string): Promise<{ message: string }> {
        const subcategory = await this.findOne(id);
        await this.subcategoryRepository.remove(subcategory);
        return { message: 'Subcategory deleted successfully' };
    }
}
