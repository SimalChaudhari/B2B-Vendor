import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtModule } from '@nestjs/jwt';
import { StockEntity } from './stock.entity';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { SyncLogService } from 'sync-log/sync-log.service';
import { SyncLogEntity } from 'sync-log/sync-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockEntity,SyncLogEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,  // Use JWT secret from .env file
      signOptions: { expiresIn: '1d' },  // Set token expiration
    }),
  ],
  controllers: [StockController],
  providers: [StockService,SyncLogService],
  exports: [StockService], // Exporting ItemService
})
export class StockModule {}