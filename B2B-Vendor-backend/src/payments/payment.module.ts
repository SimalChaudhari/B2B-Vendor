import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccountService } from './payment.service';
import { BankAccountController } from './payment.controller';
import { BankAccountEntity } from './payment.entity';
import { FirebaseService } from './../service/firebase.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [TypeOrmModule.forFeature([BankAccountEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Use your JWT secret from the .env file
      signOptions: { }, // Set your token expiration
    }),
],
    controllers: [BankAccountController],
    providers: [BankAccountService,FirebaseService],
})
export class BankAccountModule {}
