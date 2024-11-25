// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressesModule } from './addresses/addresses.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ItemModule } from './fetch-products/item.module';
import { InvoiceModule } from './invoice/invoice.module';
import { LedgerModule } from './ledger/ledger.module';
import { OrderModule } from './order/order.module';
import { SettingModule } from './settings/setting.module';
import { StockModule } from './stock/stock.module';
import { SyncLogModule } from './sync-log/sync-log.module';
import { UserModule } from './user/users.module';
import { VendorModule } from './vendors/vendor.module';

@Module({

  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true, // Automatically load entities
      synchronize: true, // Be careful using this in production
      ssl: false, // Use SSL for production
    }),
  

  // TypeOrmModule.forRoot({
  //   type: 'postgres',
  //   host: process.env.DATABASE_HOST,
  //   port: 5432,
  //   username: process.env.DATABASE_USER,
  //   password: process.env.DATABASE_PASSWORD,
  //   database: process.env.DATABASE_NAME,
  //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
  //   synchronize: true, // Set to false in production

  // }),
  UserModule,
  AuthModule,
  AddressesModule,
  ItemModule,
  SettingModule,
  VendorModule,
  CartModule,
  OrderModule,
  DashboardModule,
  InvoiceModule,
  SyncLogModule,
  StockModule,
  LedgerModule
  ],
})
export class AppModule { }
