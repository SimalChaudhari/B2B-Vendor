import { Body, Controller, HttpStatus, Param, Post, Get, Patch, Delete, Res } from '@nestjs/common';
import { Response } from 'express';
import { OfferService } from './offers.service';
import { CreateOfferDto, UpdateOfferDto } from './offer.dto';
import { Offer } from './offer.entity';

@Controller('offers')
export class OfferController {
    constructor(private readonly offerService: OfferService) {}

    @Post('create')
    async create(@Body() createOfferDto: CreateOfferDto, @Res() response: Response) {
        const offer = await this.offerService.create(createOfferDto);
        return response.status(HttpStatus.CREATED).json({
            message: 'Offer created successfully',
            data: offer,
        });
    }

    @Get()
    async findAll(@Res() response: Response) {
        const offers = await this.offerService.findAll();
        return response.status(HttpStatus.OK).json({
            length: offers.length,
            data: offers,
        });
    }

    @Get('get/:id')
    async findOne(@Param('id') id: string, @Res() response: Response) {
        const offer = await this.offerService.findOne(id);
        return response.status(HttpStatus.OK).json({ data: offer });
    }

    @Patch('update/:id')
    async update(@Param('id') id: string, @Body() updateOfferDto: UpdateOfferDto, @Res() response: Response) {
        const updatedOffer = await this.offerService.update(id, updateOfferDto);
        return response.status(HttpStatus.OK).json({
            message: 'Offer updated successfully',
            data: updatedOffer,
        });
    }

    @Delete('delete/:id')
    async delete(@Param('id') id: string, @Res() response: Response) {
        await this.offerService.delete(id);
        return response.status(HttpStatus.OK).json({ message: 'Offer deleted successfully' });
    }
}
