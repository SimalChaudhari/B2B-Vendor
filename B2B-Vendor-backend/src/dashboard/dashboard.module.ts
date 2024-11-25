// dashboard.module.ts
import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

import { OrderModule } from '../order/order.module';

import { ItemModule } from './../fetch-products/item.module';
import { UserModule } from './../user/users.module';

@Module({
  imports: [ItemModule, UserModule, OrderModule],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
