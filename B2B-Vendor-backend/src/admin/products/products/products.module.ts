import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './products.service';
import { ProductController } from './products.controller';
import { Product } from './product.entity';
import { Subcategory } from '../sub-categories/subcategory.entity';
import { Category } from '../categories/category.entity';


@Module({
    imports: [TypeOrmModule.forFeature([Product, Subcategory, Category])],
    providers: [ProductService],
    controllers: [ProductController],
})
export class ProductModule {}
