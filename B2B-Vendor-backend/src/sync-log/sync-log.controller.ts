import { Controller, Get, Post, Body } from '@nestjs/common';
import { SyncLogService } from './sync-log.service';
import { CreateSyncLogDto } from './create-sync-log.dto';

@Controller('sync-log')
export class SyncLogController {
    constructor(private readonly syncLogService: SyncLogService) {}

    @Post()
    async createSyncLog(@Body() createSyncLogDto: CreateSyncLogDto) {
        return this.syncLogService.createSyncLog(createSyncLogDto);
    }

    @Get()
    async getAllSyncLogs() {
        return this.syncLogService.getAllSyncLogs();
    }

}
