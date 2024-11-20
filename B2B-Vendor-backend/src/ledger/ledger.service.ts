import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { parseStringPromise } from 'xml2js';
import { LedgerEntity } from './ledger.entity';
import { BillEntity } from './bill.entity';
import { LedgerDto } from './ledger.dto';
import axios from 'axios';
import { ledger } from 'tally/ledger';

@Injectable()
export class LedgerService {
    private readonly logger = new Logger(LedgerService.name);

    constructor(
        @InjectRepository(LedgerEntity)
        private readonly ledgerRepository: Repository<LedgerEntity>,
        @InjectRepository(BillEntity)
        private readonly billRepository: Repository<BillEntity>,
    ) {}

    async fetchAndStoreLedgers(): Promise<void> {
        try {
            const response = await axios.get(process.env.TALLY_URL as string, {
                headers: { 'Content-Type': 'text/xml' },
                data: ledger,
            });

            const parsedData = await parseStringPromise(response.data);
            const customers = parsedData?.CUSTOMER || {}; // Default to an empty object if undefined

            this.logger.log("Fetched customers from Tally:", customers);

            // Convert customers object to an array for processing
            const customerArray = Object.values(customers);

            await this.processAndStoreCustomers(customerArray);
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

        // Save bills separately to ensure consistency
        const savedBills = await this.billRepository.save(updatedBills);
        ledger.bills = savedBills; // Assign saved bills back to the ledger
    }

    private mapToLedgerDto(customer: any): LedgerDto {
        return {
            customerName: customer?.CUSTOMERNAME?.[0] || 'Unknown Customer',
            creditLimit: parseFloat(customer?.CREDITLIMIT?.[0] || '0'),
            closingBalance: parseFloat(customer?.CLOSINGBALANCE?.[0] || '0'),
            bills: customer?.BILLS?.[0]?.BILL?.map((bill: any) => ({
                tallyOrdId: bill?.TALLYORDID?.[0] || null,
                nxOrderId: bill?.NXORDERID?.[0] || null,
                tallyInvNo: bill?.TALLYINVNO?.[0] || null,
                billDate: bill?.BILLDATE?.[0] || null,
                openingBalance: parseFloat(bill?.OPENINGBALANCE?.[0] || '0'),
                closingBalance: parseFloat(bill?.CLOSINGBALANCE?.[0] || '0'),
                creditPeriod: bill?.CREDITPERIOD?.[0] || null,
            })) || [], // Default to an empty array if BILLS is undefined
        };
    }

    async findAll(): Promise<LedgerEntity[]> {
        return this.ledgerRepository.find({ relations: ['bills'] });
    }
}
