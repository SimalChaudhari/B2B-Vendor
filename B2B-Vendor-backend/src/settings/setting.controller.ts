// src/faq/faq.controller.ts

import { Controller, Post, Get, Delete, Param, Body, InternalServerErrorException, Put, HttpStatus, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FaqService, LogoService } from './setting.service';
import { CreateFaqDto, CreateLogoDto, UpdateFaqDto } from './setting.dto';
import { Faq, Logo } from './setting.entity';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

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


@Controller('logos')
export class LogoController {
    constructor(private readonly logoService: LogoService) { }

    @Post('create')
    @UseInterceptors(FileInterceptor('logoImage')) // 'logoImage' should match the FormData field name
    async create(@UploadedFile() logoImage: Express.Multer.File) {
        return this.logoService.create({ logoImage: logoImage.buffer.toString('base64') }); // Convert buffer to base64
    }

    @Get()
    async findAll(): Promise<Logo[]> {
        return this.logoService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Logo> {
        return this.logoService.findOne(id);
    }

    @Put('update/:id')
    async update(@Param('id') id: string, @UploadedFile() logoImage: Express.Multer.File, @Body() updateLogoDto: CreateLogoDto): Promise<{ message: string; data: Logo }> {
        if (logoImage) {
            updateLogoDto.logoImage = logoImage.buffer.toString('base64');
        }
        return this.logoService.update(id, updateLogoDto);
    }

    @Delete('delete/:id')
    async remove(@Param('id') id: string, @Res() response: Response) {
        const result = await this.logoService.remove(id);
        return response.status(HttpStatus.OK).json(result);

    }
}



