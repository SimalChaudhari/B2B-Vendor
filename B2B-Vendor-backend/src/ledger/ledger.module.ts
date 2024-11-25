import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LedgerEntity } from './ledger.entity';
import { BillEntity } from './bill.entity';
import { LedgerService } from './ledger.service';
import { LedgerController } from './ledger.controller';
import { SyncControlSettings } from './../settings/setting.entity';

@Module({
    imports: [TypeOrmModule.forFeature([LedgerEntity, BillEntity,SyncControlSettings])],
    controllers: [LedgerController],
    providers: [LedgerService],
})
export class LedgerModule {}
