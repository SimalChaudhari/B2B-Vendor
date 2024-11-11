import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtModule } from '@nestjs/jwt';
import { StockEntity } from './stock.entity';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,  // Use JWT secret from .env file
      signOptions: { expiresIn: '1d' },  // Set token expiration
    }),
  ],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService], // Exporting ItemService
})
export class StockModule {}
