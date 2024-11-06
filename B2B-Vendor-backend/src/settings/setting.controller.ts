// src/faq/faq.controller.ts

import { Controller, Post, Get, Delete, Param, Body, Put, HttpStatus, Res, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { BannerService, ContactUsService, FaqService,  PrivacyPolicyService, TermsConditionsService } from './setting.service';
import { CreateBannerDto, CreateContactDto, CreateFaqDto, CreatePrivacyPolicyDto, CreateTermsConditionsDto, UpdateFaqDto } from './setting.dto';
import { ContactUs, PrivacyPolicy, TermsConditions } from './setting.entity';
import { Response } from 'express';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';


// FAQ Controller
@Controller('faq')
export class FaqController {
    constructor(private readonly faqService: FaqService) { }

    @Post('create')
    async create(@Body() createFaqDto: CreateFaqDto, @Res() response: Response) {
        const result = await this.faqService.create(createFaqDto);
        return response.status(HttpStatus.OK).json({
            message: result.message,
            data: result.data,
        });

    }

    @Get()
    async findAll(@Res() response: Response) {
        const result = await this.faqService.findAll();
        return response.status(HttpStatus.OK).json({
            length: result.length,
            data: result,
        });
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() response: Response) {
        const result = await this.faqService.findOne(id);
        return response.status(HttpStatus.OK).json({
            data: result,
        });

    }

    @Put('update/:id')
    async update(@Param('id') id: string, @Res() response: Response, @Body() updateFaqDto: UpdateFaqDto) {
        const result = await this.faqService.update(id, updateFaqDto);
        return response.status(HttpStatus.OK).json({
            message: result.message,
            data: result.data,
        });
    }

    @Delete('delete/:id')
    async remove(@Param('id') id: string, @Res() response: Response) {
        const result = await this.faqService.remove(id);
        return response.status(HttpStatus.OK).json(result);

    }
}

@Controller('privacy-policies')
export class PrivacyPolicyController {
    constructor(private readonly privacyPolicyService: PrivacyPolicyService) { }

    @Post('create')
    async create(@Body() createPrivacyPolicyDto: CreatePrivacyPolicyDto): Promise<{ message: string; data: PrivacyPolicy }> {
        return this.privacyPolicyService.create(createPrivacyPolicyDto);
    }

    @Get()
    async findAll(): Promise<PrivacyPolicy[]> {
        return this.privacyPolicyService.findAll();
    }

    @Get('get/:id')
    async findOne(@Param('id') id: string): Promise<PrivacyPolicy> {
        return this.privacyPolicyService.findOne(id);
    }

    @Put('update/:id')
    async update(@Param('id') id: string, @Body() updatePrivacyPolicyDto: CreatePrivacyPolicyDto): Promise<{ message: string; data: PrivacyPolicy }> {
        return this.privacyPolicyService.update(id, updatePrivacyPolicyDto);
    }

    @Delete('delete/:id')
    async remove(@Param('id') id: string): Promise<{ message: string }> {
        return this.privacyPolicyService.remove(id);
    }
}
//terms-conditions
@Controller('terms-conditions')
export class TermsConditionsController {
    constructor(private readonly termsConditionsService: TermsConditionsService) {}

    @Post('create')
    async create(@Body() createTermsConditionsDto: CreateTermsConditionsDto): Promise<{ message: string; data: TermsConditions }> {
        return this.termsConditionsService.create(createTermsConditionsDto);
    }

    @Get('')
    async findAll(): Promise<TermsConditions[]> {
        return this.termsConditionsService.findAll();
    }

    @Get('get/:id')
    async findOne(@Param('id') id: string): Promise<TermsConditions> {
        return this.termsConditionsService.findOne(id);
    }

    @Put('update/:id')
    async update(@Param('id') id: string, @Body() updateTermsConditionsDto: CreateTermsConditionsDto): Promise<{ message: string; data: TermsConditions }> {
        return this.termsConditionsService.update(id, updateTermsConditionsDto);
    }

    @Delete('delete/:id')
    async remove(@Param('id') id: string): Promise<{ message: string }> {
        return this.termsConditionsService.remove(id);
    }
}

// contact as Controller
@Controller('contact')
export class ContactUsController {
    constructor(private readonly contactService: ContactUsService) {}

    @Post('create')
    async create(@Body() createContactDto: CreateContactDto): Promise<{ message: string; data: ContactUs }> {
        return this.contactService.create(createContactDto);
    }

    @Get()
    async findAll(): Promise<ContactUs[]> {
        return this.contactService.findAll();
    }

    @Get('get/:id')
    async findOne(@Param('id') id: string): Promise<ContactUs> {
        return this.contactService.findOne(id);
    }

    @Put('update/:id')
    async update(@Param('id') id: string, @Body() updateContactDto: CreateContactDto): Promise<{ message: string; data: ContactUs }> {
        return this.contactService.update(id, updateContactDto);
    }

    @Delete('delete/:id')
    async remove(@Param('id') id: string):  Promise<{ message: string }> {
        return this.contactService.remove(id);
    }
}

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post('/create')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'bannerImages', maxCount: 10 }])) // Allow up to 10 images
  async createBanner(
    @UploadedFiles() files: { bannerImages?: Express.Multer.File[] }
  ) {
    return this.bannerService.createBannerWithImages(files.bannerImages || []);
  }

  @Put('/update/:id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'bannerImages', maxCount: 10 }]))
  async updateBanner(
    @Param('id') id: string,
    @UploadedFiles() files: { bannerImages?: Express.Multer.File[] }
  ) {
    return this.bannerService.updateBannerImages(id, files.bannerImages || []);
  }

 // Retrieve all banners
 @Get('/all')
 async getAllBanners() {
   return this.bannerService.getAllBanners();
 }

 // Retrieve a specific banner by ID
 @Get('/:id')
 async getBannerById(@Param('id') id: string) {
   return this.bannerService.getBannerById(id);
 }

 // Delete a specific banner by ID
 @Delete('/delete/:id')
 async deleteBanner(@Param('id') id: string) {
   return this.bannerService.deleteBanner(id);
 }
}




