import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { parseStringPromise } from 'xml2js';
import { LedgerEntity, LedgerStatementEntity, LedgerVoucherEntity } from './ledger.entity';
import { BillEntity } from './bill.entity';
import { LedgerDto } from './ledger.dto';
import axios from 'axios';
import { ledger, receivable } from '../tally/ledger';
import { SyncControlSettings } from './../settings/setting.entity';
import { Cron } from '@nestjs/schedule';
import { SyncLogEntity, SyncLogStatus } from './../sync-log/sync-log.entity';

@Injectable()
export class LedgerService {
    private readonly logger = new Logger(LedgerService.name);

    constructor(
        @InjectRepository(LedgerEntity)
        private readonly ledgerRepository: Repository<LedgerEntity>,
        @InjectRepository(BillEntity)
        private readonly billRepository: Repository<BillEntity>,


        @InjectRepository(SyncLogEntity)
        private readonly syncLogRepository: Repository<SyncLogEntity>,

        @InjectRepository(SyncControlSettings)
        private readonly syncControlSettingsRepository: Repository<SyncControlSettings>,

        @InjectRepository(LedgerStatementEntity)
        private readonly ledgerStatementRepo: Repository<LedgerStatementEntity>,

        @InjectRepository(LedgerVoucherEntity)
        private readonly ledgerVoucherRepo: Repository<LedgerVoucherEntity>,

    ) { }

    // OutStanding Receivables

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
                data: receivable,
            });

            // Check for specific XML error patterns in the response
            if (response.data.includes('<LINEERROR>')) {
                throw new BadRequestException('Please Login The Tally');
            }

            const parsedData = await parseStringPromise(response.data, { explicitArray: true });

            const customers = Array.isArray(parsedData?.CUSTOMER)
                ? parsedData.CUSTOMER
                : parsedData?.CUSTOMER
                    ? [parsedData.CUSTOMER]
                    : [];

            await this.processAndStoreCustomers(customers);


        } catch (error: any) {
            // If the error is already a BadRequestException, rethrow it
            if (error instanceof BadRequestException) {
                throw error;
            }

            if (error.code === 'ECONNABORTED') {
                throw new InternalServerErrorException(
                    'Tally request timed out. Please ensure Tally is open and accessible.',
                );
            }
            // General error handling
            throw new InternalServerErrorException('Make Sure Tally is Open and logged In');
        }
    }


    async deleteMultiple(ids: string[]): Promise<{ message: string }> {
        const notFoundIds: string[] = [];

        for (const id of ids) {
            const ledger = await this.findById(id);
            if (!ledger) {
                notFoundIds.push(id);
                continue; // skip this ID if not found
            }
            await this.ledgerRepository.remove(ledger);
        }

        if (notFoundIds.length > 0) {
            throw new NotFoundException(`outstanding with ids ${notFoundIds.join(', ')} not found`);
        }

        return { message: 'outstanding deleted successfully' };
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
    @Cron('0 0 * * * *') // Runs every 60 seconds
    async CronFetchAndStoreLedgers(): Promise<void> {
        console.log('Outstanding Receivables sync executed at:', new Date().toISOString());

        // Check if "Auto Sync" is enabled
        const syncSetting = await this.syncControlSettingsRepository.findOne({
            where: { moduleName: 'Outstanding Receivables' },
        });

        if (!syncSetting?.isAutoSyncEnabled) {
            throw new BadRequestException('Auto Sync for Outstanding Receivables is disabled.');
        }

        try {
            const response = await axios.get(process.env.TALLY_URL as string, {
                headers: { 'Content-Type': 'text/xml' },
                data: ledger, // Replace with your dynamic XML request
            });

            // Check for specific XML error patterns in the response
            if (response.data.includes('<LINEERROR>')) {
                throw new BadRequestException('Please log in to Tally.');
            }

            const parsedData = await parseStringPromise(response.data, { explicitArray: true });
            const customers = Array.isArray(parsedData?.CUSTOMER)
                ? parsedData.CUSTOMER
                : parsedData?.CUSTOMER
                    ? [parsedData.CUSTOMER]
                    : [];

            await this.processAndStoreCustomers(customers);

            // Log successful sync
            await this.syncLogRepository.save({
                sync_type: 'Receivables',
                status: SyncLogStatus.SUCCESS,
            });
        } catch (error: any) {
            // Log failed sync
            await this.syncLogRepository.save({
                sync_type: 'Receivables',
                status: SyncLogStatus.FAIL,
            });

            if (error instanceof BadRequestException) throw error;

            if (error.code === 'ECONNABORTED') {
                throw new InternalServerErrorException(
                    'Tally request timed out. Please ensure Tally is open and accessible.',
                );
            }

            throw new InternalServerErrorException('Make sure Tally is open and logged in.');
        }
    }

    // Ledger Statements

    private hasChanges(existingStatement: LedgerStatementEntity, newVouchers: Partial<LedgerVoucherEntity>[]): boolean {
        if (existingStatement.vouchers.length !== newVouchers.length) {
            return true; // Number of vouchers changed
        }

        // Compare each voucher
        for (let i = 0; i < existingStatement.vouchers.length; i++) {
            const existingVoucher = existingStatement.vouchers[i];
            const newVoucher = newVouchers[i];

            if (
                existingVoucher.date !== newVoucher.date ||
                existingVoucher.ledger !== newVoucher.ledger ||
                existingVoucher.voucherType !== newVoucher.voucherType ||
                existingVoucher.voucherNo !== newVoucher.voucherNo ||
                existingVoucher.debitAmount !== newVoucher.debitAmount ||
                existingVoucher.creditAmount !== newVoucher.creditAmount
            ) {
                return true; // At least one voucher differs
            }
        }

        return false; // No changes detected
    }



    async fetchAndLedgers(): Promise<void> {
        try {
            const response = await axios.get(process.env.TALLY_URL as string, {
                headers: { 'Content-Type': 'text/xml' },
                data: ledger,
            });

            if (!response.data) {
                throw new BadRequestException('No data received from Tally.');
            }

            // Parse the response XML
            const parsedData = await parseStringPromise(response.data, { explicitArray: true });

            const statementData = parsedData.LEDGERSTATEMENT;
            if (!statementData) {
                throw new BadRequestException('Invalid data received from Tally.');
            }

            // Extract vouchers
            const newVouchers = statementData.LEDGERVOUCHERS.map((voucher: any) => ({
                date: voucher.DATE[0],
                ledger: voucher.LEDGER[0] || null,
                voucherType: voucher.VCHTYPE[0],
                voucherNo: voucher.VCHNO[0],
                debitAmount: parseFloat(voucher.DEBITAMT[0] || '0'),
                creditAmount: parseFloat(voucher.CREDITAMT[0] || '0'),
            }));

            // Check if a ledger statement already exists for the party
            const existingStatement = await this.ledgerStatementRepo.findOne({
                where: { party: statementData.PARTY[0] },
                relations: ['vouchers'],
            });

            if (existingStatement) {
                // Compare existing data with new data
                const hasChanges = this.hasChanges(existingStatement, newVouchers);

                if (hasChanges) {
                    // Update the existing record
                    existingStatement.vouchers = this.ledgerVoucherRepo.create(newVouchers); // Replace vouchers
                    await this.ledgerStatementRepo.save(existingStatement);
                    console.log(`Updated ledger for party: ${statementData.PARTY[0]}`);
                } else {
                    console.log(`No changes detected for party: ${statementData.PARTY[0]}`);
                }
            } else {
                // Create a new record
                const newLedgerStatement = this.ledgerStatementRepo.create({
                    party: statementData.PARTY[0],
                    vouchers: this.ledgerVoucherRepo.create(newVouchers),
                });
                await this.ledgerStatementRepo.save(newLedgerStatement);
                console.log(`Inserted new ledger for party: ${statementData.PARTY[0]}`);
            }
        } catch (error: any) {
            throw new InternalServerErrorException(`Error fetching data from Tally: ${error.message}`);
        }
    }


    // Retrieve all ledger statements
    async findLedgerData(): Promise<LedgerStatementEntity[]> {
        return this.ledgerStatementRepo.find();
    }

    // Retrieve a specific ledger statement by ID
    async findByIdLedgerData(id: string): Promise<LedgerStatementEntity> {
        const statement = await this.ledgerStatementRepo.findOne({ where: { id } });
        if (!statement) {
            throw new NotFoundException('Ledger statement not found.');
        }
        return statement;
    }
}
