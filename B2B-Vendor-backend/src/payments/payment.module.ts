import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccountService } from './payment.service';
import { BankAccountController } from './payment.controller';
import { BankAccountEntity } from './payment.entity';
import { FirebaseService } from './../service/firebase.service';

@Module({
    imports: [TypeOrmModule.forFeature([BankAccountEntity])],
    controllers: [BankAccountController],
    providers: [BankAccountService,FirebaseService],
})
export class BankAccountModule {}
