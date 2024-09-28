import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
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
    ) { }

    async create(createSubcategoryDto: CreateSubcategoryDto): Promise<Subcategory> {
        // Check if categoryId is provided
        if (!createSubcategoryDto.categoryId) {
            throw new BadRequestException('Category ID must be provided');
        }
        // Check if the category exists
        const category = await this.categoryRepository.findOne({ where: { id: createSubcategoryDto.categoryId } });
        if (!category) {
            throw new NotFoundException('Category not found');
        }

        // Check if a subcategory with the same name (case-insensitive) already exists in the same category
        const existingSubcategory = await this.subcategoryRepository.findOne({
            where: {
                name: ILike(createSubcategoryDto.name), // ILike is used for case-insensitive comparisons
                category: { id: createSubcategoryDto.categoryId },
            },
        });

        if (existingSubcategory) {
            throw new ConflictException('Subcategory with this name already exists');
        }

        // Create subcategory with the associated category
        // Create subcategory with the associated category
        const subcategory = this.subcategoryRepository.create({
            ...createSubcategoryDto,
            category, // Associate with the found category
        });

        return await this.subcategoryRepository.save(subcategory);
    }

    async update(id: string, updateSubcategoryDto: UpdateSubcategoryDto): Promise<Subcategory> {
        const subcategory = await this.findOne(id); // Find the subcategory by ID

        if (!subcategory) {
            throw new NotFoundException('Subcategory not found');
        }

        // Check if a category ID is being updated and validate it
        if (updateSubcategoryDto.categoryId) {
            const category = await this.categoryRepository.findOne({ where: { id: updateSubcategoryDto.categoryId } });
            if (!category) {
                throw new NotFoundException('Category not found');
            }
            subcategory.category = category; // Update the category if valid
        }

        // Check if a subcategory with the same name (case-insensitive) already exists in the same category
        if (updateSubcategoryDto.name) {
            const existingSubcategory = await this.subcategoryRepository.findOne({
                where: {
                    name: ILike(updateSubcategoryDto.name), // ILike for case-insensitive name checking
                    category: { id: subcategory.category.id },
                    id: Not(id), // Exclude the current subcategory from the check
                },
            });

            if (existingSubcategory) {
                throw new ConflictException('Subcategory with this name already exists');
            }
        }

        // Update the subcategory with new data
        Object.assign(subcategory, updateSubcategoryDto);

        return await this.subcategoryRepository.save(subcategory); // Save the updated subcategory
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
