import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

import * as dotenv from 'dotenv';
import { UserModule } from 'users/users.module';
import { ProductModule } from 'admin/products/product.module';
import { CategoryModule } from 'admin/categories/category.module';
import { OfferModule } from 'admin/offer/offer.module';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb+srv://dev4:0HCuUNNZHfU0e9gC@cluster0.kmnexdn.mongodb.net/b2b-vendor'),
    AuthModule,
    UserModule,
    ProductModule,
    CategoryModule,
    OfferModule
  ],
})
export class AppModule { }
