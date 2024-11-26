import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { LedgerService } from './ledger.service';

@Controller('ledgers')
export class LedgerController {
    constructor(private readonly ledgerService: LedgerService) { }

    @Post('/receivable/fetch')
    async fetchLedgers(@Res() response: Response) {
        await this.ledgerService.fetchAndStoreLedgers();
        return response.status(200).json({ message: 'Ledgers fetched and stored successfully.' });
    }

    @Get('/receivable')
    async findAll(@Res() response: Response) {
        const ledgers = await this.ledgerService.findAll();
        return response.status(200).json({ data: ledgers });
    }

    @Get('/receivable/:id')
    async findById(@Param('id') id: string, @Res() response: Response) {
        const ledger = await this.ledgerService.findById(id);
        if (!ledger) {
            throw new NotFoundException('Ledger not found');
        }
        return response.status(200).json({ data: ledger });
    }

    @Delete('/receivable/:id')
    async deleteById(@Param('id') id: string, @Res() response: Response) {
        const deleted = await this.ledgerService.deleteById(id);
        if (!deleted) {
            throw new NotFoundException('Ledger not found');
        }
        return response.status(200).json({ message: 'Ledger deleted successfully.' });
    }

    @Delete('delete/all')
    async deleteMultiple(@Body('ids') ids: string[], @Res() response: Response) {
        try {
            const result = await this.ledgerService.deleteMultiple(ids);
            return response.status(HttpStatus.OK).json(result);
        } catch (error) {
            // Handle the error appropriately
            if (error instanceof NotFoundException) {
                return response.status(HttpStatus.NOT_FOUND).json({ message: error.message });
            }
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while deleting the data.' });
        }
    }
}
