import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubcategoryService } from './subcategories.service';
import { SubcategoryController } from './subcategories.controller';
import { Subcategory } from './subcategory.entity';
import { Category } from '../categories/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Subcategory, Category])],
    providers: [SubcategoryService],
    controllers: [SubcategoryController],
    exports: [SubcategoryService],
})
export class SubcategoryModule {}
