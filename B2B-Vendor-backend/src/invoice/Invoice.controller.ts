import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice, InvoiceStatus } from './invoice.entity';
import { InvoiceRetryService } from './invoice-retry.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'auth/jwt/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('retry-invoice')
export class InvoiceController {
    constructor(
        @InjectRepository(Invoice)
        private readonly invoiceRepository: Repository<Invoice>,
        private readonly invoiceRetryService: InvoiceRetryService,
    ) { }

    @Get('pending')
    async getPendingInvoices(@Req() req: Request): Promise<Invoice[]> {
        // Filter invoices by the authenticated user's ID
        const userId = req.user.userId;
        return this.invoiceRepository.find({
            where: { status: InvoiceStatus.PENDING, userId },
        });
    }

    @Post('post-pending')
    async postPendingInvoices(
        @Req() req: Request,
    ): Promise<{ status: string; message: string }> {
        // Retrieve the user's ID from the request object
        const userId = req['user'].userId;

        // Call the service and return its JSON response directly
        return await this.invoiceRetryService.postPendingInvoices(userId);
    }

    @Patch('enable-disable')
    async toggleInvoiceFeature(
        @Req() req: Request,
        @Body() body: { enabled: boolean },
    ): Promise<{ status: string; message: string }> {
        const userId = req['user'].userId;

        await this.invoiceRepository.update(
            { userId },
            { enabled: body.enabled },
        );

        return {
            status: 'success',
            message: `Invoice posting feature has been ${body.enabled ? 'enabled' : 'disabled'}.`,
        };
    }
}
