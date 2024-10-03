// src/faq/faq.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaqController, LogoController } from './setting.controller';
import { FaqService, LogoService } from './setting.service';
import { Faq, Logo } from './setting.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Faq,Logo])],
    controllers: [FaqController,LogoController],
    providers: [FaqService,LogoService],
})
export class SettingModule {}
