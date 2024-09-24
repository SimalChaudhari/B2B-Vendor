// product.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Category } from 'admin/categories/category.schema';
import { Document ,Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
    save(): Product | PromiseLike<Product> {
        throw new Error('Method not implemented.');
    }
    @Prop({ required: true })
    name!: string;

    @Prop({ required: true })
    description!: string;

    @Prop({ required: true })
    price!: number;

    @Prop({ type: String, ref: Category.name })
    category?: Types.ObjectId;

    @Prop()
    imageUrl?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
