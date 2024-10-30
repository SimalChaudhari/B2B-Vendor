// dashboard.module.ts
import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

import { OrderModule } from '../order/order.module';
import { UserModule } from 'users/user/users.module';
import { ItemModule } from 'fetch-products/item.module';

@Module({
  imports: [ItemModule, UserModule, OrderModule],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
