import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SyncLog } from './sync-log.entity';
import { CreateSyncLogDto } from './create-sync-log.dto';

@Injectable()
export class SyncLogService {
    constructor(
        @InjectRepository(SyncLog)
        private readonly syncLogRepository: Repository<SyncLog>,
    ) {}

    async createSyncLog(createSyncLogDto: CreateSyncLogDto): Promise<SyncLog> {
        const syncLog = this.syncLogRepository.create(createSyncLogDto);
        return await this.syncLogRepository.save(syncLog);
    }

    async getAllSyncLogs(): Promise<SyncLog[]> {
        return await this.syncLogRepository.find();
    }

 
}
