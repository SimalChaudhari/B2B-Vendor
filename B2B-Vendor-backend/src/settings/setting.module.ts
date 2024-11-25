// src/faq/faq.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaqController, PrivacyPolicyController, TermsConditionsController, ContactUsController, BannerController, SyncControlSettingsController } from './setting.controller';
import { FaqService, PrivacyPolicyService, TermsConditionsService, ContactUsService, BannerService, SyncControlSettingsService } from './setting.service';
import { Faq, PrivacyPolicy, TermsConditions, ContactUs, Banner, SyncControlSettings } from './setting.entity';
import { FirebaseService } from './../service/firebase.service';

@Module({
    imports: [TypeOrmModule.forFeature([Faq, PrivacyPolicy, TermsConditions, ContactUs,Banner,SyncControlSettings])],
    controllers: [FaqController, PrivacyPolicyController, TermsConditionsController, ContactUsController,BannerController,SyncControlSettingsController],
    providers: [FaqService, PrivacyPolicyService, TermsConditionsService, ContactUsService,BannerService,FirebaseService,SyncControlSettingsService],
})
export class SettingModule { }
