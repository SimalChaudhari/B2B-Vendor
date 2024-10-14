// Item.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemService } from './item.service';
import { ItemEntity } from './item.entity';
import { ItemController } from './itemController';
import { FirebaseService } from 'service/firebase.service';

@Module({
  imports: [TypeOrmModule.forFeature([ItemEntity])],
  controllers: [ItemController],
  providers: [ItemService,FirebaseService],
})
export class ItemModule {}
