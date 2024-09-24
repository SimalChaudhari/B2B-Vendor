import { Controller, Post, Get, Put, Delete, Param, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post('create')
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        const category = await this.categoryService.create(createCategoryDto);
        return { message: 'Category created successfully', data: category };
    }

    @Get()
    async findAll(@Res() response: Response) {
        const categories = await this.categoryService.findAll();
        return response.status(HttpStatus.OK).json({ length: categories.length, data: categories });
    }

    @Get(':id')
    async getById(@Param('id') id: string, @Res() response: Response) {
        const category = await this.categoryService.getById(id);
        return response.status(HttpStatus.OK).json({ data: category });
    }

    @Put('update/:id')
    async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @Res() response: Response) {
        const updatedCategory = await this.categoryService.update(id, updateCategoryDto);
        return response.status(HttpStatus.OK).json({ message: 'Category updated successfully', data: updatedCategory });
    }

    @Delete('delete/:id')
    async remove(@Param('id') id: string, @Res() response: Response) {
        const result = await this.categoryService.remove(id);
        return response.status(HttpStatus.OK).json(result);
    }
}
