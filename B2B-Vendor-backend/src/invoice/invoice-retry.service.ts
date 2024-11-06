// invoice-retry.service.ts
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice, InvoiceStatus } from './invoice.entity';
import axios from 'axios';
import { SyncLog } from 'sync-log/sync-log.entity';

@Injectable()
export class InvoiceRetryService {

    constructor(
        @InjectRepository(Invoice)
        private readonly invoiceRepository: Repository<Invoice>,
        @InjectRepository(SyncLog)
        private readonly syncLogRepository: Repository<SyncLog>, // Repository for logging sync attempts

    ) { }

    async postPendingInvoices(userId: string): Promise<{ status: string; message: string }> {
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

        let allSuccess = true;

        for (const invoice of pendingInvoices) {
            try {
                const response = await axios.post(process.env.TALLY_URL as string, invoice.xmlContent, {
                    headers: { 'Content-Type': 'application/xml' },
                });

                if (response.data.includes('<LINEERROR>')) {
                    allSuccess = false; // Set the flag to false if any invoice fails
                    continue; // Skip deletion for this invoice and move to the next
                }
                // Delete the invoice from the database after successful posting
                await this.invoiceRepository.delete(invoice.id);

            } catch (error) {
                allSuccess = false; // Set the flag to false if any invoice fails
                return {
                    status: 'error',
                    message: 'Please ensure Tally is open and try again.',
                };
            }
        }

        // Return the appropriate message based on success or failure
        if (allSuccess) {
            return {
                status: 'success',
                message: 'All pending invoices have been successfully posted to Tally.',
            };
        } else {
            return {
                status: 'partial_success',
                message: 'Please log in to Tally, or the data may not be available in Tally.'

            };
        }
    }

    // @Cron('*/1 * * * *') // Run every 10 minutes

    // async retryPendingInvoices() {
    //     // Check if there are pending invoices
    //     const pendingInvoices = await this.invoiceRepository.find({
    //         where: { status: InvoiceStatus.PENDING },
    //     });

    //     // If no pending invoices, exit the function without logging
    //     if (pendingInvoices.length === 0) {
    //         console.log("No pending invoices. Sync not required.");
    //         return;
    //     }

    //     // // Proceed with sync log entry creation only if there are pending invoices
    //     // const syncLog = new SyncLog();
    //     // syncLog.timestamp = new Date();
    //     // syncLog.attempt_count = 0;
    //     // syncLog.status = 'IN_PROGRESS';

    //     // await this.syncLogRepository.save(syncLog);

    //     // let successCount = 0;
    //     // let failureCount = 0;

    //     // for (const invoice of pendingInvoices) {
    //     //     syncLog.attempt_count += 1;

    //     //     try {
    //     //         const response = await axios.post(process.env.TALLY_URL as string, invoice.xmlContent, {
    //     //             headers: { 'Content-Type': 'application/xml' },
    //     //         });

    //     //         if (response.data.includes('<LINEERROR>')) {
    //     //             failureCount += 1;
    //     //             continue;
    //     //         }

    //     //         await this.invoiceRepository.delete(invoice.id);
    //     //         successCount += 1;

    //     //     } catch (error) {
    //     //         console.error(`Failed to resend invoice ${invoice.id}`);
    //     //         failureCount += 1;
    //     //     }
    //     // }

    //     // // Update status based on success/failure counts
    //     // syncLog.status = failureCount === 0
    //     //     ? 'SUCCESS'
    //     //     : (successCount > 0 ? 'PARTIAL_SUCCESS' : 'FAILURE');


    //     // await this.syncLogRepository.save(syncLog);
    // }

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


}    