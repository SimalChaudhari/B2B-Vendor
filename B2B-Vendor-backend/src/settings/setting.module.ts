// src/faq/faq.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaqController, PrivacyPolicyController, TermsConditionsController, ContactUsController, BannerController } from './setting.controller';
import { FaqService, PrivacyPolicyService, TermsConditionsService, ContactUsService, BannerService } from './setting.service';
import { Faq, PrivacyPolicy, TermsConditions, ContactUs, Banner } from './setting.entity';
import { FirebaseService } from 'service/firebase.service';

@Module({
    imports: [TypeOrmModule.forFeature([Faq, PrivacyPolicy, TermsConditions, ContactUs,Banner])],
    controllers: [FaqController, PrivacyPolicyController, TermsConditionsController, ContactUsController,BannerController],
    providers: [FaqService, PrivacyPolicyService, TermsConditionsService, ContactUsService,BannerService,FirebaseService],
})
export class SettingModule { }
