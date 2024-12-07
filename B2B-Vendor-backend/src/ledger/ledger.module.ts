import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LedgerEntity, LedgerStatementEntity, LedgerVoucherEntity } from './ledger.entity';
import { BillEntity } from './bill.entity';
import { LedgerService } from './ledger.service';
import { LedgerController } from './ledger.controller';
import { SyncControlSettings } from './../settings/setting.entity';
import { SyncLogEntity } from './../sync-log/sync-log.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([LedgerEntity, BillEntity, SyncControlSettings, SyncLogEntity, LedgerStatementEntity, LedgerVoucherEntity]),
        JwtModule.register({
            secret: process.env.JWT_SECRET,  // Use JWT secret from .env file
            signOptions: {},  // Set token expiration
        }),
    ],
    controllers: [LedgerController],
    providers: [LedgerService],
})
export class LedgerModule { }
