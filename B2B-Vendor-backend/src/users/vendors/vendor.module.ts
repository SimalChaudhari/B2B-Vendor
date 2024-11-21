import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VendorService } from './vendor.service'; // Import the VendorService
import { VendorEntity } from './vendor.entity'; // Import the VendorEntity
import { VendorController } from './vendor.controller'; // Import the VendorController
import { UserService } from 'users/user/users.service';
import { User } from 'users/user/users.entity';
import { Address } from 'users/address/addresses/addresses.entity';
import { AddressesService } from 'users/address/addresses/addresses.service';
import { SyncLogEntity } from 'sync-log/sync-log.entity';
import { SyncLogService } from 'sync-log/sync-log.service';
@Module({
  imports: [TypeOrmModule.forFeature([VendorEntity,User,Address,SyncLogEntity])], // Register the VendorEntity
  controllers: [VendorController], // Register the VendorController
  providers: [VendorService,AddressesService,SyncLogService], // Register the VendorService and FirebaseService
})
export class VendorModule {}
