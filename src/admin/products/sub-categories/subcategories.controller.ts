import { Controller, Get, Post, Body, Param, Put, Delete, Res, HttpStatus } from '@nestjs/common';
import { SubcategoryService } from './subcategories.service';
import { CreateSubcategoryDto, UpdateSubcategoryDto } from './subcategory.dto';
import { Response } from 'express';

@Controller('subcategories')
export class SubcategoryController {
    constructor(private readonly subcategoryService: SubcategoryService) {}

    @Post('create')
    async create(@Body() createSubcategoryDto: CreateSubcategoryDto, @Res() response: Response) {
        const subcategory = await this.subcategoryService.create(createSubcategoryDto);
        return response.status(HttpStatus.CREATED).json(subcategory);
    }

    @Put('update/:id')
    async update(@Param('id') id: string, @Body() updateSubcategoryDto: UpdateSubcategoryDto, @Res() response: Response) {
        const subcategory = await this.subcategoryService.update(id, updateSubcategoryDto);
        return response.status(HttpStatus.OK).json(subcategory);
    }

    @Get()
    async findAll(@Res() response: Response) {
        const subcategories = await this.subcategoryService.findAll();
        return response.status(HttpStatus.OK).json(subcategories);
    }

    @Get('get/:id')
    async findOne(@Param('id') id: string, @Res() response: Response) {
        const subcategory = await this.subcategoryService.findOne(id);
        return response.status(HttpStatus.OK).json(subcategory);
    }

    @Delete('delete/:id')
    async delete(@Param('id') id: string, @Res() response: Response) {
        const result = await this.subcategoryService.delete(id);
        return response.status(HttpStatus.OK).json(result);
    }
}
