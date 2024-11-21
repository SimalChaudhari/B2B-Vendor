import { Controller, Get, Post, Body } from '@nestjs/common';
import { SyncLogService } from './sync-log.service';
import { CreateSyncLogDto } from './create-sync-log.dto';
import { SyncLogEntity } from './sync-log.entity';

@Controller('sync-log')
export class SyncLogController {
  constructor(private readonly syncLogService: SyncLogService) {}

  // Create a new sync log
  @Post()
  async createSyncLog(@Body() createSyncLogDto: CreateSyncLogDto): Promise<SyncLogEntity> {
    return this.syncLogService.createSyncLog(createSyncLogDto);
  }

  // Get all sync logs
  @Get()
  async getAllSyncLogs(): Promise<SyncLogEntity[]> {
    return this.syncLogService.getAllSyncLogs();
  }
}
