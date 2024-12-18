// Item.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemService } from './item.service';
import { ItemEntity } from './item.entity';
import { ItemController } from './itemController';
import { FirebaseService } from './../service/firebase.service';
import { SyncControlSettings } from './../settings/setting.entity';
import { SyncLogEntity } from './../sync-log/sync-log.entity';
import { SyncLogService } from './../sync-log/sync-log.service';
import { JwtModule } from '@nestjs/jwt';
import { UserEntity } from './../user/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemEntity,SyncLogEntity,SyncControlSettings,UserEntity]),
 JwtModule.register({
            secret: process.env.JWT_SECRET,  // Use JWT secret from .env file
            signOptions: {},  // Set token expiration
        }),
],
  controllers: [ItemController],
  providers: [ItemService,FirebaseService,SyncLogService],
  exports: [ItemService], // Exporting ItemService
})
export class ItemModule {}
