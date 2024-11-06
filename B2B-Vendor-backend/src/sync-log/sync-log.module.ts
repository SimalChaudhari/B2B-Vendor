import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncLogController } from './sync-log.controller';
import { SyncLogService } from './sync-log.service';
import { SyncLog } from './sync-log.entity';

@Module({
    imports: [TypeOrmModule.forFeature([SyncLog])],
    controllers: [SyncLogController],
    providers: [SyncLogService],
    exports: [SyncLogService], // Export InvoiceService if needed in other modules
})
export class SyncLogModule {}
