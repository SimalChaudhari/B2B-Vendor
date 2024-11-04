// invoice-retry.service.ts

import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice, InvoiceStatus } from './invoice.entity';
import axios from 'axios';

@Injectable()
export class InvoiceRetryService {
    constructor(
        @InjectRepository(Invoice)
        private readonly invoiceRepository: Repository<Invoice>,
    ) { }

    async postPendingInvoices(userId: string): Promise<{ status: string; message: string }> {
        // Fetch all pending invoices for the given user
        const pendingInvoices = await this.invoiceRepository.find({
            where: {
                status: InvoiceStatus.PENDING,
                userId: userId,
            },
        });
    
        // If no pending invoices, return a "data up-to-date" message
        if (pendingInvoices.length === 0) {
            return {
                status: 'success',
                message: 'All data is up to date.',
            };
        }
    
        // Process each pending invoice
        for (const invoice of pendingInvoices) {
            try {
                const response = await axios.post('http://localhost:9000', invoice.xmlContent, {
                    headers: { 'Content-Type': 'application/xml' },
                });
               // Delete the invoice from the database after successful posting
                await this.invoiceRepository.delete(invoice.id);
    
            } catch (error) {
                return {
                    status: 'error',
                    message: 'Please ensure Tally is open and try again.',
                };
            }
        }
        // If all invoices posted successfully, return a success message in JSON format
        return {
            status: 'success',
            message: 'All pending invoices have been successfully posted to Tally.',
        };
    }
    


    @Cron('*/1 * * * *') // Run every 5 minutes
    async retryPendingInvoices() {
        // Fetch all pending invoices
        const pendingInvoices = await this.invoiceRepository.find({
            where: { status: InvoiceStatus.PENDING },
        });

        for (const invoice of pendingInvoices) {
            try {
                const response = await axios.post('http://localhost:9000', invoice.xmlContent, {
                    headers: { 'Content-Type': 'application/xml' },
                });
                console.log(`Successfully resent invoice for order ${invoice.orderId}:`, response.data);
                // Update the invoice status to SENT on successful post
                invoice.status = InvoiceStatus.SENT;
                // Delete the invoice from the database after successful posting
                await this.invoiceRepository.delete(invoice.id);

            } catch (error) {
                console.error(`Failed to resend invoice for order ${invoice.orderId}:`, error);
                // Keep the status as PENDING for retrying again in the next cron job
            }
        }
    }
}
