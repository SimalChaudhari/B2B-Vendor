// dashboard.module.ts
import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { ItemModule } from './../fetch-products/item.module';
import { UserModule } from './../user/users.module';
import { OrderModule } from './../order/order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [TypeOrmModule.forFeature([ItemModule, UserModule, OrderModule]),
  JwtModule.register({
             secret: process.env.JWT_SECRET,  // Use JWT secret from .env file
             signOptions: {},  // Set token expiration
         }),
 ],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule { }
