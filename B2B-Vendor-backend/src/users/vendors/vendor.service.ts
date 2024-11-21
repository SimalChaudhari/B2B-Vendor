import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { parseStringPromise } from 'xml2js'; // Library for parsing XML to JSON
import { VendorEntity } from './vendor.entity'; // Make sure to import your Vendor Entity
import { Vendors } from 'tally/vendors';
import { User, UserRole } from 'users/user/users.entity';
import { VendorDto } from './../user/users.dto';
import { AddressesService } from 'users/address/addresses/addresses.service';
import { CreateAddressDto } from 'users/address/addresses/addresses.dto';
import { Cron } from '@nestjs/schedule';
import { SyncLogEntity, SyncLogStatus } from 'sync-log/sync-log.entity';
import { SyncLogService } from 'sync-log/sync-log.service';

@Injectable()
export class VendorService {
    constructor(
        @InjectRepository(User)
        private vendorRepository: Repository<User>,
        private readonly addressesService: AddressesService,

        @InjectRepository(SyncLogEntity)
        private readonly syncLogRepository: Repository<SyncLogEntity>,
        private readonly syncLogService: SyncLogService,

    ) { }

    async fetchAndStoreVendors(): Promise<void> {
        const REQUEST_TIMEOUT = 20000; // 20 seconds timeout
        try {
            const response = await axios.get(process.env.TALLY_URL as string, {
                headers: {
                    'Content-Type': 'text/xml',
                },
                data: Vendors, // Replace with your dynamic XML request
                timeout: REQUEST_TIMEOUT, // Set a timeout for the request
            });

            const vendors = await this.parseXmlToVendors(response.data);
            const existingVendors = await this.vendorRepository.find();

            // Create a map of existing vendors for quick lookup
            const existingVendorMap = new Map(existingVendors.map(vendor => [vendor.name, vendor]));

            for (const vendor of vendors) {
                const existingVendor = existingVendorMap.get(vendor.name);

                if (existingVendor) {
                    // If the item exists, compare and update if necessary
                    if (this.hasChanges(existingVendor, vendor)) {
                        await this.vendorRepository.save({ ...existingVendor, ...vendor });
                    } else {
                        console.log(`No changes for vendor: ${vendor.name}`);
                    }
                    // Handle address separately
                    await this.storeVendorAddress(existingVendor, vendor);
                } else {
                    const savedVendor = await this.vendorRepository.save(vendor);
                    await this.storeVendorAddress(savedVendor, vendor);
                    console.log(`New vendor and address saved: ${vendor.name}`);
                }
            }

        } catch (error: any) {
            // Handle timeout specifically for login error message
            if (error.code === 'ECONNABORTED') {
                throw new InternalServerErrorException(
                    'Please log in to Tally and try again.'
                );
            }

            // Handle general error if Tally is not accessible
            throw new InternalServerErrorException(
                'Please ensure Tally is open and accessible, then try again.'
            );
        }
    }

    async storeVendorAddress(vendor: User, vendorDto: VendorDto): Promise<void> {
        const createAddressDto: CreateAddressDto = {
            userId: vendor.id,
            mobile: vendorDto.mobile || 'N/A',
            street_address: vendorDto.address || 'N/A',
            state: vendorDto.state || 'N/A',
            zip_code: vendorDto.pincode || 'N/A',
            country: vendorDto.country || 'N/A',
        };

        const existingAddress = await this.addressesService.findByUserId(vendor.id);
        if (existingAddress) {
            await this.addressesService.update(existingAddress.id, createAddressDto);
        } else {
            await this.addressesService.create(createAddressDto, vendor.id);
        }
    }

    async parseXmlToVendors(xml: string): Promise<User[]> {
        const parsedResult = await parseStringPromise(xml);
        const vendorItems = parsedResult.ENVELOPE.LEDGER || []; // Adjust based on your XML structure

        return vendorItems.map((vendor: any) => {
            const vendorDto = new VendorDto();
            vendorDto.slNo = this.cleanString(vendor.SLNO?.[0]);
            vendorDto.name = this.cleanString(vendor.NAME?.[0]);
            vendorDto.alias = this.cleanString(vendor.ALIAS?.[0]);
            vendorDto.active = this.cleanString(vendor.ACTIVE?.[0]);
            vendorDto.parent = this.cleanString(vendor.PARENT?.[0]);
            vendorDto.address = this.cleanString(vendor.ADDRESS?.[0]);
            vendorDto.country = this.cleanString(vendor.COUNTRY?.[0]);
            vendorDto.state = this.cleanString(vendor.STATE?.[0]);
            vendorDto.pincode = this.cleanString(vendor.PINCODE?.[0]);
            vendorDto.contactPerson = this.cleanString(vendor.CONTACTPERSON?.[0]);
            vendorDto.mobile = this.cleanString(vendor.PHONE?.[0]);
            vendorDto.email = this.cleanString(vendor.EMAIL?.[0]);
            vendorDto.pan = this.cleanString(vendor.PAN?.[0]);
            vendorDto.gstType = this.cleanString(vendor.GSTTYPE?.[0]);
            vendorDto.gstNo = this.cleanString(vendor.GSTNO?.[0]);
            vendorDto.gstDetails = this.cleanString(vendor.GSTDETAILS?.[0]);
            // Convert DTO to Entity
            return this.vendorRepository.create(vendorDto);
        });
    }

    private cleanString(value: string | undefined): string {
        return value?.replace(/\x04/g, '').trim() || '';
    }

    // Function to check if the existing vendor has changes
    private hasChanges(existingVendor: User, newVendor: User): boolean {
        return (
            existingVendor.slNo !== newVendor.slNo ||
            existingVendor.name !== newVendor.name ||
            existingVendor.alias !== newVendor.alias ||
            existingVendor.active !== newVendor.active ||
            existingVendor.parent !== newVendor.parent ||
            existingVendor.address !== newVendor.address ||
            existingVendor.country !== newVendor.country ||
            existingVendor.state !== newVendor.state ||
            existingVendor.pincode !== newVendor.pincode ||
            existingVendor.contactPerson !== newVendor.contactPerson ||
            existingVendor.mobile !== newVendor.mobile ||
            existingVendor.email !== newVendor.email ||
            existingVendor.pan !== newVendor.pan ||
            existingVendor.gstType !== newVendor.gstType ||
            existingVendor.gstNo !== newVendor.gstNo ||
            existingVendor.gstDetails !== newVendor.gstDetails
        );
    }

    // private getUpdatedFields(existingVendor: User, newVendor: VendorDto): Partial<User> {
    //     const updatedFields: Partial<User> = {};
    //     if (existingVendor.slNo !== newVendor.slNo) updatedFields.slNo = newVendor.slNo;
    //     if (existingVendor.name !== newVendor.name) updatedFields.name = newVendor.name;
    //     if (existingVendor.alias !== newVendor.alias) updatedFields.alias = newVendor.alias;
    //     if (existingVendor.active !== newVendor.active) updatedFields.active = newVendor.active;
    //     if (existingVendor.parent !== newVendor.parent) updatedFields.parent = newVendor.parent;
    //     if (existingVendor.contactPerson !== newVendor.contactPerson) updatedFields.contactPerson = newVendor.contactPerson;
    //     if (existingVendor.mobile !== newVendor.mobile) updatedFields.mobile = newVendor.mobile;
    //     if (existingVendor.email !== newVendor.email) updatedFields.email = newVendor.email;
    //     if (existingVendor.pan !== newVendor.pan) updatedFields.pan = newVendor.pan;
    //     if (existingVendor.gstType !== newVendor.gstType) updatedFields.gstType = newVendor.gstType;
    //     if (existingVendor.gstNo !== newVendor.gstNo) updatedFields.gstNo = newVendor.gstNo;
    //     if (existingVendor.gstDetails !== newVendor.gstDetails) updatedFields.gstDetails = newVendor.gstDetails;

    //     return updatedFields;
    // }

    async findAll(): Promise<User[]> {
        return this.vendorRepository.find({
            where: { role: UserRole.Vendor }, // Use UserRole enum to match the role correctly
        });
    }

    async findById(id: string): Promise<User | null> {
        return this.vendorRepository.findOne({ where: { id } }); // Load files for the vendor by ID
    }
    async delete(id: string): Promise<void> {
        const result = await this.vendorRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Vendor with ID  not found`);
        }
    }


    // Cron Job Set
        @Cron('*/60 * * * * *') // Runs every 60 seconds
        async CronFetchAndStoreVendors(): Promise<void> {
            console.log('Vendor executed at:', new Date().toISOString());
            const REQUEST_TIMEOUT = 20000; // 20 seconds timeout

            let successCount = 0;
            let failedCount = 0;

            try {
                const response = await axios.get(process.env.TALLY_URL as string, {
                    headers: {
                        'Content-Type': 'text/xml',
                    },
                    data: Vendors, // Replace with your dynamic XML request
                    timeout: REQUEST_TIMEOUT, // Set a timeout for the request
                });

                const vendors = await this.parseXmlToVendors(response.data);
                const existingVendors = await this.vendorRepository.find();

                // Create a map of existing vendors for quick lookup
                const existingVendorMap = new Map(existingVendors.map(vendor => [vendor.name, vendor]));

                for (const vendor of vendors) {
                    const existingVendor = existingVendorMap.get(vendor.name);
                    try {
                        if (existingVendor) {
                            // If the item exists, compare and update if necessary
                            if (this.hasChanges(existingVendor, vendor)) {
                                await this.vendorRepository.save({ ...existingVendor, ...vendor });
                                successCount++;
                            } else {
                                console.log(`No changes for vendor: ${vendor.name}`);
                            }
                            // Handle address separately
                            await this.storeVendorAddress(existingVendor, vendor);
                        } else {
                            const savedVendor = await this.vendorRepository.save(vendor);
                            await this.storeVendorAddress(savedVendor, vendor);
                            console.log(`New vendor and address saved: ${vendor.name}`);
                            successCount++;
                        }
                    } catch (itemError) {
                        failedCount++;
                    }
                }
                await this.syncLogRepository.save({
                    sync_type: 'vendors',
                    success_count: successCount,
                    failed_count: failedCount,
                    total_count: vendors.length,
                    status: SyncLogStatus.SUCCESS, // Enum value
                  });
            } catch (error: any) {
                failedCount++;
                await this.syncLogRepository.save({
                    sync_type: 'vendors',
                    success_count: successCount,
                    failed_count: failedCount,
                    total_count: 0,
                    status: SyncLogStatus.FAIL, // Enum value
                });
                // Handle timeout specifically for login error message
                if (error.code === 'ECONNABORTED') {
                    throw new InternalServerErrorException(
                        'Please log in to Tally and try again.'
                    );
                }

                // Handle general error if Tally is not accessible
                throw new InternalServerErrorException(
                    'Please ensure Tally is open and accessible, then try again.'
                );
            }
        }

    // @Cron('*/60 * * * * *')
    // async cronFetchAndStoreVendors(): Promise<void> {
    //     console.log('Vendor sync executed at:', new Date().toISOString());
    //     await this.syncLogService.fetchAndStoreData(
    //         process.env.TALLY_URL as string,
    //         Vendors, // XML payload for vendors
    //         this.parseXmlToVendors.bind(this), // XML parsing function for vendors
    //         this.vendorRepository,
    //         'vendor',
    //         'vendors',
    //         this.syncLogRepository
    //     );
    // }


    @Cron('0 0 * * 0') // Runs weekly at midnight on Sunday to delete logs older than two minutes.
    async cleanupAllLogs(): Promise<void> {
        console.log('Complete log cleanup started:', new Date().toISOString());

        try {
            // Delete all logs without any condition
            const result = await this.syncLogRepository.delete({});

            console.log(`Complete log cleanup completed. Deleted ${result.affected} logs.`);
        } catch (error) {
            console.error('Complete log cleanup failed:', error);
        }
    }

}
