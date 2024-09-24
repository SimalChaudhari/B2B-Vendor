import { Controller, Get, Post, Body, Param, Delete, Res, HttpStatus, Put } from '@nestjs/common';
import { OfferService } from './offer.service';
import { Offer } from './offer.schema';
import { CreateOfferDto, UpdateOfferDto } from './offer.dto';
import { Response } from 'express';

@Controller('offers')
export class OfferController {
    constructor(private readonly offerService: OfferService) { }

    @Post('create')
    async create(@Body() createOfferDto: CreateOfferDto): Promise<Offer> {
        return this.offerService.create(createOfferDto);
    }

    @Get()
    async findAll(): Promise<Offer[]> {
        return this.offerService.findAll();
    }

    @Get(':id')

    async findById(@Param('id') id: string): Promise<Offer> {
        return this.offerService.findById(id);
    }

    @Put('update/:id')
    async update(@Param('id') id: string, @Body() updateOfferDto: UpdateOfferDto): Promise<Offer> {
        return this.offerService.update(id, updateOfferDto);
    }


    @Delete('delete/:id')
    async remove(@Param('id') id: string, @Res() response: Response) {
        const result = await this.offerService.remove(id);
        return response.status(HttpStatus.OK).json(result);
    }
}
