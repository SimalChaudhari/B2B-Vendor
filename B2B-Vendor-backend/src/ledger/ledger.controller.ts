import { Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { LedgerService } from './ledger.service';

@Controller('ledgers')
export class LedgerController {
    constructor(private readonly ledgerService: LedgerService) {}

    @Post('/fetch')
    async fetchLedgers(@Res() response: Response) {
        await this.ledgerService.fetchAndStoreLedgers();
        return response.status(200).json({ message: 'Ledgers fetched and stored successfully.' });
    }

    @Get()
    async findAll(@Res() response: Response) {
        const ledgers = await this.ledgerService.findAll();
        return response.status(200).json({ data: ledgers });
    }
}
