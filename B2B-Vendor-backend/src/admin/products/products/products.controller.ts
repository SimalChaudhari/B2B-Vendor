import { Body, Controller, HttpStatus, Param, Post, Get, Patch, Delete, Res } from '@nestjs/common';
import { Response } from 'express';
import { ProductService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { Product } from './product.entity';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post('create')
    async create(@Body() createProductDto: CreateProductDto, @Res() response: Response) {
        const product = await this.productService.create(createProductDto);
        return response.status(HttpStatus.CREATED).json({
            message: 'Product created successfully',
            data: product,
        });
    }

    @Get()
    async findAll(@Res() response: Response) {
        const products = await this.productService.findAll();
        return response.status(HttpStatus.OK).json({
            length: products.length,
            data: products,
        });
    }

    @Get('get/:id')
    async findOne(@Param('id') id: string, @Res() response: Response) {
        const product = await this.productService.findOne(id);
        return response.status(HttpStatus.OK).json({ data: product });
    }

    @Patch('update/:id')
    async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @Res() response: Response) {
        const updatedProduct = await this.productService.update(id, updateProductDto);
        return response.status(HttpStatus.OK).json({
            message: 'Product updated successfully',
            data: updatedProduct,
        });
    }

    @Delete('delete/:id')
    async delete(@Param('id') id: string, @Res() response: Response) {
        await this.productService.delete(id);
        return response.status(HttpStatus.OK).json({ message: 'Product deleted successfully' });
    }
}
