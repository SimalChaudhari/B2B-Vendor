import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product, ProductSchema } from './product.schema';
import { CategoryModule } from '../categories/category.module'; // Adjust the path as necessary

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
        CategoryModule // Import the CategoryModule here
    ],
    controllers: [ProductController],
    providers: [ProductService],
    exports: [MongooseModule] // Export MongooseModule for Category
})
export class ProductModule {}
