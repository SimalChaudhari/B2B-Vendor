// Item.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemService } from './item.service';
import { ItemEntity } from './item.entity';
import { ItemController } from './itemController';
import { FirebaseService } from 'service/firebase.service';
import { SyncLogEntity } from 'sync-log/sync-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemEntity,SyncLogEntity])],
  controllers: [ItemController],
  providers: [ItemService,FirebaseService],
  exports: [ItemService], // Exporting ItemService
})
export class ItemModule {}
