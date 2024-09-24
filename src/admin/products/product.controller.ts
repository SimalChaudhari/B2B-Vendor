// product.controller.ts
import { Controller, Post, Get, Put, Delete, Param, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './product.dto';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}
    

    @Post('create')
    async create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto);
    }

    @Get('get-all')
    async getAllProducts(@Res() response: Response) {
        const products = await this.productService.findAll();
        return response.status(HttpStatus.OK).json({
            length: products.length,
            data: products,
        });
    }

    @Get(':id')
    async getProductById(@Param('id') id: string, @Res() response: Response) {
        const product = await this.productService.getById(id);
        return response.status(HttpStatus.OK).json({
            data: product,
        });
    }

    @Put('update/:id')
    async updateProduct(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
        @Res() response: Response,
    ) {
        const updatedProduct = await this.productService.updateProduct(id, updateProductDto);
        return response.status(HttpStatus.OK).json({
            message: "Product successfully updated",
            data: updatedProduct,
        });
    }

    @Delete('delete/:id')
    async remove(@Param('id') id: string, @Res() response: Response) {
        const result = await this.productService.remove(id);
        return response.status(HttpStatus.OK).json(result);
    }
}
