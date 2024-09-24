import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types } from 'mongoose';

export type OfferDocument = Offer & Document;

@Schema()
export class Offer {
    @Prop({ required: true })
    offerName!: string;

    @Prop({ required: true })
    discountPercentage!: number;

    @Prop({ required: true })
    startDate!: Date;

    @Prop({ required: true })
    endDate!: Date;

    @Prop({ type: 'ObjectId', ref: 'Product', required: true })
    product!: Types.ObjectId;;
}

export const OfferSchema = SchemaFactory.createForClass(Offer);
