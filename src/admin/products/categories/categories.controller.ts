import { Controller, Get, Post, Body, Param, Put, Delete, Res, HttpStatus } from '@nestjs/common';
import { CategoryService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { Response } from 'express';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post('create')
    async create(@Body() createCategoryDto: CreateCategoryDto, @Res() response: Response) {
        const category = await this.categoryService.create(createCategoryDto);
        return response.status(HttpStatus.CREATED).json(category);
    }

    @Put('update/:id')
    async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @Res() response: Response) {
        const category = await this.categoryService.update(id, updateCategoryDto);
        return response.status(HttpStatus.OK).json(category);
    }

    @Get()
    async findAll(@Res() response: Response) {
        const categories = await this.categoryService.findAll();
        return response.status(HttpStatus.OK).json(categories);
    }

    @Get('get/:id')
    async findOne(@Param('id') id: string, @Res() response: Response) {
        const category = await this.categoryService.findOne(id);
        return response.status(HttpStatus.OK).json(category);
    }

    @Delete('delete/:id')
    async delete(@Param('id') id: string, @Res() response: Response) {
        const result = await this.categoryService.delete(id);
        return response.status(HttpStatus.OK).json(result);
    }
}
