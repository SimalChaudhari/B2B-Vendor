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
import { UserModule } from './user/users.module';
import { VendorModule } from './vendors/vendor.module';
import { SyncLogModule } from './sync-log/sync-log.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BankAccountModule } from './payments/payment.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      // ssl: true, // Enable SSL
      // extra: {
      //   ssl: {
      //     rejectUnauthorized: false, // For self-signed certificates; ensure proper certificates in production
      //   },
      // },
    }),
    
  
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
  LedgerModule,
  BankAccountModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
