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

        // Check if invoice posting is enabled
        const isEnabled = await this.invoiceRepository.findOne({
            where: { userId, enabled: true },
        });

        if (!isEnabled) {
            return {
                status: 'disabled',
                message: 'The invoice posting feature is currently disabled.',
            };
        }

        const pendingInvoices = await this.invoiceRepository.find({
            where: {
                status: InvoiceStatus.PENDING,
                userId: userId,
            },
        });

        if (pendingInvoices.length === 0) {
            return {
                status: 'success',
                message: 'All data is up to date.',
            };
        }

        for (const invoice of pendingInvoices) {
            try {
                const response = await axios.post(process.env.TALLY_URL as string, invoice.xmlContent, {
                    headers: { 'Content-Type': 'application/xml' },
                });

                if (response.data.includes('<LINEERROR>')) {
                    // Immediately return partial success message if there’s a line error
                    return {
                        status: 'partial_success',
                        message: 'Some invoices could not be posted. Please log in to Tally or check sync logs for more details.',
                    };
                }

                // Delete the invoice from the database after successful posting
                await this.invoiceRepository.delete(invoice.id);


            } catch (error) {
                return {
                    status: 'error',
                    message: 'Please ensure Tally is open and accessible, then try again.',
                };
            }
        }

        return {
            status: 'success',
            message: 'All pending invoices have been successfully posted to Tally.',
        };
    }

    // @Cron('*/10 * * * * *') // Runs every 5 seconds
    async retryPendingInvoices(userId: string): Promise<{ status: string; message: string }> {
        console.log("sync.......1")
        // Check if invoice posting is enabled
        const isEnabled = await this.invoiceRepository.findOne({
            where: { userId, enabled: true },
        });

        if (!isEnabled) {
            return {
                status: 'disabled',
                message: 'The invoice posting feature is currently disabled.',
            };
        }
        console.log("sync.......2")
        const pendingInvoices = await this.invoiceRepository.find({
            where: {
                status: InvoiceStatus.PENDING,
                userId: userId,
            },
        });

        if (pendingInvoices.length === 0) {
            return {
                status: 'success',
                message: 'All data is up to date.',
            };
        }

        for (const invoice of pendingInvoices) {
        console.log("sync.......4")

            try {
                const response = await axios.post(process.env.TALLY_URL as string, invoice.xmlContent, {
                    headers: { 'Content-Type': 'application/xml' },
                });

                if (response.data.includes('<LINEERROR>')) {
                    // Immediately return partial success message if there’s a line error
                    return {
                        status: 'partial_success',
                        message: 'Some invoices could not be posted. Please log in to Tally or check sync logs for more details.',
                    };
                }

                // Delete the invoice from the database after successful posting
                await this.invoiceRepository.delete(invoice.id);


            } catch (error) {
                console.log("sync.......3")
                return {
                    status: 'error',
                    message: 'Please ensure Tally is open and accessible, then try again.',
                };
            }
        }

        return {
            status: 'success',
            message: 'All pending invoices have been successfully posted to Tally.',
        };
    }

}

// @Cron('*/1 * * * *') // Run every 1 minute
// async retryPendingInvoices() {

//     let isRunning = false;
//     if (isRunning) {
//         console.log("Job already in progress. Skipping this run.");
//         return;
//     }

//     isRunning = true;
//     try {
//         // Check if there are pending invoices
//         const pendingInvoices = await this.invoiceRepository.find({
//             where: { status: InvoiceStatus.PENDING },
//         });

//         if (pendingInvoices.length === 0) {
//             console.log("No pending invoices. Sync not required.");
//             return;
//         }

//         // Your sync logic here
//         console.log("Sync job running...");

//     } finally {
//         isRunning = false; // Release the lock
//     }
// }


