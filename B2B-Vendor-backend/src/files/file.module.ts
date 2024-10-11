// file.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './file.entity';

import { ItemEntity } from 'fetch-products/item.entity';
import { FileController } from './files.controller';
import { FileService } from './files.service';
import { FirebaseService } from 'service/firebase.service';


@Module({
  imports: [TypeOrmModule.forFeature([File,ItemEntity])],
  controllers: [FileController],
  providers: [FileService,FirebaseService],
})
export class FileModule {}
