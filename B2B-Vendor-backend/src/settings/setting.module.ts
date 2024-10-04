// src/faq/faq.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaqController, LogoController, PrivacyPolicyController, TermsConditionsController, ContactUsController } from './setting.controller';
import { FaqService, LogoService, PrivacyPolicyService, TermsConditionsService, ContactUsService } from './setting.service';
import { Faq, Logo, PrivacyPolicy, TermsConditions, ContactUs } from './setting.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Faq, Logo, PrivacyPolicy, TermsConditions, ContactUs])],
    controllers: [FaqController, LogoController, PrivacyPolicyController, TermsConditionsController, ContactUsController],
    providers: [FaqService, LogoService, PrivacyPolicyService, TermsConditionsService, ContactUsService],
})
export class SettingModule { }
