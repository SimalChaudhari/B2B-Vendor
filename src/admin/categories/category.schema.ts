import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema()
export class Category {
    save(): Category | PromiseLike<Category> {
        throw new Error('Method not implemented.');
    }
    @Prop({ required: true })
    name!: string;

    @Prop()
    description?: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
