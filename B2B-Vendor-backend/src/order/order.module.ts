import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { JwtModule } from '@nestjs/jwt';
import { ItemEntity } from 'fetch-products/item.entity';
import { User } from 'users/user/users.entity';
import { Address } from 'users/address/addresses/addresses.entity';
import { OrderItemEntity } from './order.item.entity';
import { CartItemEntity } from 'cart/cart.entity';
import { InvoiceRetryService } from 'invoice/invoice-retry.service';
import { Invoice } from 'invoice/invoice.entity';
import { SyncLog } from 'sync-log/sync-log.entity';
import { EmailService } from 'service/email/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity,ItemEntity,User,Address,OrderItemEntity,CartItemEntity,Invoice, SyncLog]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,  // Use JWT secret from .env file
      signOptions: { expiresIn: '1d' },  // Set token expiration
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService,InvoiceRetryService,EmailService],
  exports: [OrderService], // Exporting ItemService
})
export class OrderModule {}
