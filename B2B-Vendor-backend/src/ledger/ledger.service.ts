import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { parseStringPromise } from 'xml2js';
import { LedgerEntity } from './ledger.entity';
import { BillEntity } from './bill.entity';
import { LedgerDto } from './ledger.dto';
import axios from 'axios';
import { ledger } from 'tally/ledger';
import { SyncControlSettings } from './../settings/setting.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class LedgerService {
    private readonly logger = new Logger(LedgerService.name);

    constructor(
        @InjectRepository(LedgerEntity)
        private readonly ledgerRepository: Repository<LedgerEntity>,
        @InjectRepository(BillEntity)
        private readonly billRepository: Repository<BillEntity>,

        @InjectRepository(SyncControlSettings)
        private readonly syncControlSettingsRepository: Repository<SyncControlSettings>,
    ) { }

    async fetchAndStoreLedgers(): Promise<void> {
        // Check if "Auto Sync" is enabled 
        const SyncSetting = await this.syncControlSettingsRepository.findOne({
            where: { moduleName: 'Outstanding Receivables' },
        });

        if (!SyncSetting || !SyncSetting.isManualSyncEnabled) {
            throw new BadRequestException('Auto Sync for Outstanding Receivables is disabled.');
        }

        try {
            const response = await axios.get(process.env.TALLY_URL as string, {
                headers: { 'Content-Type': 'text/xml' },
                data: ledger,
            });

            const parsedData = await parseStringPromise(response.data, { explicitArray: true });
            console.log('Parsed Data:', JSON.stringify(parsedData, null, 2));

            const customers = Array.isArray(parsedData?.CUSTOMER)
                ? parsedData.CUSTOMER
                : parsedData?.CUSTOMER
                    ? [parsedData.CUSTOMER]
                    : [];

            console.log('Customers:', customers);
            await this.processAndStoreCustomers(customers);
        } catch (error: any) {
            this.logger.error('Error fetching or processing ledgers', error.stack);
            if (error.code === 'ECONNABORTED') {
                throw new InternalServerErrorException(
                    'Tally request timed out. Please ensure Tally is open and accessible.',
                );
            }
            throw new InternalServerErrorException('Failed to process ledger data.');
        }
    }



    private async processAndStoreCustomers(customers: any[]): Promise<void> {
        const existingLedgers = await this.ledgerRepository.find({ relations: ['bills'] });
        const existingLedgerMap = new Map(existingLedgers.map(ledger => [ledger.customerName, ledger]));

        const ledgersToInsert: LedgerEntity[] = [];
        const ledgersToUpdate: LedgerEntity[] = [];

        for (const customer of customers) {
            const ledgerDto = this.mapToLedgerDto(customer);
            const existingLedger = existingLedgerMap.get(ledgerDto.customerName);

            if (existingLedger) {
                await this.updateLedgerEntity(existingLedger, ledgerDto);
                ledgersToUpdate.push(existingLedger);
            } else {
                const newLedger = this.ledgerRepository.create(ledgerDto);
                ledgersToInsert.push(newLedger);
            }
        }

        // Insert new ledgers
        if (ledgersToInsert.length > 0) {
            await this.ledgerRepository.save(ledgersToInsert);
            this.logger.log(`Inserted ${ledgersToInsert.length} new ledgers`);
        }

        // Update existing ledgers
        if (ledgersToUpdate.length > 0) {
            for (const ledger of ledgersToUpdate) {
                await this.ledgerRepository.save(ledger);
            }
        }
    }

    private async updateLedgerEntity(ledger: LedgerEntity, dto: LedgerDto): Promise<void> {
        ledger.creditLimit = dto.creditLimit;
        ledger.closingBalance = dto.closingBalance;

        const updatedBills = dto.bills.map(billDto => {
            const existingBill = ledger.bills.find(bill => bill.tallyInvNo === billDto.tallyInvNo);
            if (existingBill) {
                return Object.assign(existingBill, billDto);
            } else {
                return this.billRepository.create(billDto);
            }
        });

        const savedBills = await this.billRepository.save(updatedBills);
        ledger.bills = savedBills;

        await this.ledgerRepository.save(ledger);
    }

    private mapToLedgerDto(customer: any): LedgerDto {
        // Log the raw customer data
        console.log('Raw Customer Data:', customer);

        return {
            customerName: customer?.CUSTOMERNAME?.[0] || 'Unknown Customer',
            creditLimit: parseFloat(customer?.CREDITLIMIT?.[0] || '0'),
            closingBalance: parseFloat(customer?.CLOSINGBALANCE?.[0] || '0'),
            bills: customer?.BILLS
                ? customer.BILLS.map((bill: any) => ({
                    tallyOrdId: bill?.TALLYORDID?.[0] || null,
                    nxOrderId: bill?.NXORDERID?.[0] || null,
                    tallyInvNo: bill?.TALLYINVNO?.[0] || null,
                    billDate: bill?.BILLDATE?.[0] || null,
                    openingBalance: parseFloat(bill?.OPENINGBALANCE?.[0] || '0'),
                    closingBalance: parseFloat(bill?.CLOSINGBALANCE?.[0] || '0'),
                    creditPeriod: bill?.CREDITPERIOD?.[0] || null,
                }))
                : [],
        };
    }

    async findAll(): Promise<LedgerEntity[]> {
        return this.ledgerRepository.find({ relations: ['bills'] });
    }

    // Fetch ledger by ID
    async findById(id: string): Promise<LedgerEntity | null> {
        return this.ledgerRepository.findOne({ where: { id }, relations: ['bills'] });
    }

    // Delete ledger by ID
    async deleteById(id: string): Promise<boolean> {
        const ledger = await this.ledgerRepository.findOne({ where: { id }, relations: ['bills'] });
        if (!ledger) {
            return false;
        }

        // Remove associated bills first
        if (ledger.bills.length > 0) {
            await this.billRepository.remove(ledger.bills);
        }

        // Remove ledger
        await this.ledgerRepository.remove(ledger);
        return true;
    }


    // cron job set
    @Cron('*/60 * * * * *')
    async CronFetchAndStoreLedgers(): Promise<void> {
        console.log('Outstanding executed at:', new Date().toISOString());

        // Check if "Auto Sync" is enabled 
        const SyncSetting = await this.syncControlSettingsRepository.findOne({
            where: { moduleName: 'Outstanding Receivables' },
        });

        if (!SyncSetting || !SyncSetting.isAutoSyncEnabled) {
            throw new BadRequestException('Auto Sync for Outstanding Receivables is disabled.');
        }

        try {
            const response = await axios.get(process.env.TALLY_URL as string, {
                headers: { 'Content-Type': 'text/xml' },
                data: ledger,
            });

            const parsedData = await parseStringPromise(response.data, { explicitArray: true });
            console.log('Parsed Data:', JSON.stringify(parsedData, null, 2));

            const customers = Array.isArray(parsedData?.CUSTOMER)
                ? parsedData.CUSTOMER
                : parsedData?.CUSTOMER
                    ? [parsedData.CUSTOMER]
                    : [];

            console.log('Customers:', customers);
            await this.processAndStoreCustomers(customers);
        } catch (error: any) {
            this.logger.error('Error fetching or processing ledgers', error.stack);
            if (error.code === 'ECONNABORTED') {
                throw new InternalServerErrorException(
                    'Tally request timed out. Please ensure Tally is open and accessible.',
                );
            }
            throw new InternalServerErrorException('Failed to process ledger data.');
        }
    }

}
