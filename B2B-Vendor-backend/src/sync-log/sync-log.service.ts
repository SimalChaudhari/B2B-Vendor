import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { SyncLogEntity } from './sync-log.entity';
import { CreateSyncLogDto } from './create-sync-log.dto';

@Injectable()
export class SyncLogService {
  constructor(
    @InjectRepository(SyncLogEntity)
    private readonly syncLogRepository: Repository<SyncLogEntity>,
  ) {}

  // Create a new sync log
  async createSyncLog(createSyncLogDto: CreateSyncLogDto): Promise<SyncLogEntity> {
    // Explicitly cast the DTO to DeepPartial<SyncLogEntity>
    const syncLog = this.syncLogRepository.create(createSyncLogDto as DeepPartial<SyncLogEntity>);
    return this.syncLogRepository.save(syncLog);
  }

  // Get all sync logs
  async getAllSyncLogs(): Promise<SyncLogEntity[]> {
    return this.syncLogRepository.find({
      order: { created_at: 'DESC' },
    });
  }
}
