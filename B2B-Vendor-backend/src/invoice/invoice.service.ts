import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice, InvoiceStatus } from './invoice.entity';
import axios from 'axios';

@Injectable()
export class InvoiceService {
    constructor(
        @InjectRepository(Invoice)
        private readonly invoiceRepository: Repository<Invoice>,
    ) {}
    

    async postToTally(xmlContent: string, orderId: string): Promise<void> {
        try {
            const response = await axios.post(process.env.TALLY_URL as string, xmlContent, {
                headers: {
                    'Content-Type': 'application/xml',
                },
            });
            console.log('Tally Response:', response.data);

        } catch (error) {
            console.error('Error posting to Tally:', error);

            // Save the unsent invoice for later retry
            const unsentInvoice = this.invoiceRepository.create({
                orderId,
                xmlContent,
                status: InvoiceStatus.PENDING,
            });
            await this.invoiceRepository.save(unsentInvoice);

            throw new Error('Failed to post invoice to Tally. It will be retried later.');
        }
    }
}
