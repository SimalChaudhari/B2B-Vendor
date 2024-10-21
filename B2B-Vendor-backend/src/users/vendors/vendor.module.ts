import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VendorService } from './vendor.service'; // Import the VendorService
import { VendorEntity } from './vendor.entity'; // Import the VendorEntity
import { VendorController } from './vendor.controller'; // Import the VendorController
import { UserService } from 'users/user/users.service';
import { User } from 'users/user/users.entity';
import { Address } from 'users/address/addresses/addresses.entity';
import { AddressesService } from 'users/address/addresses/addresses.service';
@Module({
  imports: [TypeOrmModule.forFeature([VendorEntity,User,Address])], // Register the VendorEntity
  controllers: [VendorController], // Register the VendorController
  providers: [VendorService,AddressesService], // Register the VendorService and FirebaseService
})
export class VendorModule {}
