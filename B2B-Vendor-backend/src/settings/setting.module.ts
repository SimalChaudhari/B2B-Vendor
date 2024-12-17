// src/faq/faq.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaqController, PrivacyPolicyController, TermsConditionsController, ContactUsController, BannerController, SyncControlSettingsController } from './setting.controller';
import { FaqService, PrivacyPolicyService, TermsConditionsService, ContactUsService, BannerService, SyncControlSettingsService } from './setting.service';
import { Faq, PrivacyPolicy, TermsConditions, ContactUs, Banner, SyncControlSettings } from './setting.entity';
import { FirebaseService } from './../service/firebase.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [TypeOrmModule.forFeature([Faq, PrivacyPolicy, TermsConditions, ContactUs,Banner,SyncControlSettings]),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Use your JWT secret from the .env file
      signOptions: { }, // Set your token expiration
    }),
],
    controllers: [FaqController, PrivacyPolicyController, TermsConditionsController, ContactUsController,BannerController,SyncControlSettingsController],
    providers: [FaqService, PrivacyPolicyService, TermsConditionsService, ContactUsService,BannerService,FirebaseService,SyncControlSettingsService],
})
export class SettingModule { }
