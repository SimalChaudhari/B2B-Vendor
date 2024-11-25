import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorService } from './vendor.service'; // Import the VendorService
import { VendorEntity } from './vendor.entity'; // Import the VendorEntity
import { VendorController } from './vendor.controller'; // Import the VendorController
import { SyncLogEntity } from './../sync-log/sync-log.entity';
import { SyncLogService } from 'sync-log/sync-log.service';
import { UserEntity} from './../user/users.entity';
import { AddressEntity } from 'addresses/addresses.entity';
import { AddressesService } from 'addresses/addresses.service';
import { SyncControlSettings } from './../settings/setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VendorEntity,UserEntity,AddressEntity,SyncLogEntity,SyncControlSettings])], // Register the VendorEntity
  controllers: [VendorController], // Register the VendorController
  providers: [VendorService,AddressesService,SyncLogService], // Register the VendorService and FirebaseService
})
export class VendorModule {}
