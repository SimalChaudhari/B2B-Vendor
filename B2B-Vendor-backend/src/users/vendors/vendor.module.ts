import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VendorService } from './vendor.service'; // Import the VendorService
import { VendorEntity } from './vendor.entity'; // Import the VendorEntity
import { VendorController } from './vendor.controller'; // Import the VendorController
@Module({
  imports: [TypeOrmModule.forFeature([VendorEntity])], // Register the VendorEntity
  controllers: [VendorController], // Register the VendorController
  providers: [VendorService], // Register the VendorService and FirebaseService
})
export class VendorModule {}
