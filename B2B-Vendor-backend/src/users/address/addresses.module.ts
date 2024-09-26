import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { Address } from './addresses.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [TypeOrmModule.forFeature([Address]),
    JwtModule.register({
        secret: process.env.JWT_SECRET, // Use your JWT secret from the .env file
        signOptions: { }, // Set your token expiration
      }),
    ],
    providers: [AddressesService],
    controllers: [AddressesController],
    exports: [AddressesService],
})
export class AddressesModule {}
