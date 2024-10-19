// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module'; // Adjust the path as necessary
import { AddressesModule } from 'users/address/addresses/addresses.module';
import { CategoryModule } from 'admin/products/categories/categories.module';
import { SubcategoryModule } from 'admin/products/sub-categories/subcategories.module';
import { ProductModule } from 'admin/products/products/products.module';
import { OfferModule } from 'admin/products/offers/offers.module';
import { UserModule } from 'users/user/users.module';
import { SettingModule } from 'settings/setting.module';
import { ItemModule } from 'fetch-products/item.module';
import { VendorModule } from 'users/vendors/vendor.module';
import { CartModule } from 'cart/cart.module';
import { OrderModule } from 'order/order.module';
// import { FileModule } from 'files/file.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Set to false in production
    }),
    AuthModule,
    UserModule,
    AddressesModule,
    CategoryModule,
    SubcategoryModule,
    ProductModule,
    ItemModule,
    OfferModule,
    SettingModule,
    VendorModule,
    CartModule,
    OrderModule
    // FileModule
  ],
})
export class AppModule { }
