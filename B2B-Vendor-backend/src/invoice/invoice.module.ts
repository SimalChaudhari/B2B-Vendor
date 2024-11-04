import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InvoiceRetryService } from './invoice-retry.service';
import { Invoice } from './invoice.entity';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './Invoice.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        ScheduleModule.forRoot(), // Enables scheduling
        TypeOrmModule.forFeature([Invoice]), // Registers Invoice repository
        JwtModule.register({
            secret: process.env.JWT_SECRET,  // Use JWT secret from .env file
            signOptions: { expiresIn: '1d' },  // Set token expiration
          }),
        ],
    
    providers: [InvoiceService, InvoiceRetryService],
    controllers: [InvoiceController],
    exports: [InvoiceService,InvoiceRetryService], // Export InvoiceService if needed in other modules
})
export class InvoiceModule {}
