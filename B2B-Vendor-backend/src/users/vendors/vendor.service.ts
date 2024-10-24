import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { parseStringPromise } from 'xml2js'; // Library for parsing XML to JSON
import { VendorEntity } from './vendor.entity'; // Make sure to import your Vendor Entity
import { Vendors } from 'tally/vendors';
import { User } from 'users/user/users.entity';
import { VendorDto } from './../user/users.dto';
import { AddressesService } from 'users/address/addresses/addresses.service';
import { CreateAddressDto } from 'users/address/addresses/addresses.dto';

@Injectable()
export class VendorService {
    constructor(
        @InjectRepository(User)
        private vendorRepository: Repository<User>,
        private readonly addressesService: AddressesService,
    ) { }

    async fetchAndStoreVendors(): Promise<void> {
        try {
            const response = await axios.get(process.env.TALLY_URL as string, {
                headers: {
                    'Content-Type': 'text/xml',
                },
                data: Vendors, // Replace with your dynamic XML request
            });

            const vendors = await this.parseXmlToVendors(response.data);
            const existingVendors = await this.vendorRepository.find();

            // Create a map of existing vendors for quick lookup
            const existingVendorMap = new Map(existingVendors.map(vendor => [vendor.name, vendor]));

            for (const vendor of vendors) {
                const existingVendor = existingVendorMap.get(vendor.name);

                if (existingVendor) {
                    const vendorUpdated = this.hasChanges(existingVendor, vendor);
                    if (vendorUpdated) {
                        await this.vendorRepository.update(existingVendor.id, this.getUpdatedFields(existingVendor, vendor));
                        console.log(`Vendor updated: ${vendor.name}`);
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

        } catch (error) {
            console.log("🚀 ~ VendorService ~ fetchAndStoreVendors ~ error:", error)
            throw new InternalServerErrorException('Failed to fetch vendors');
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

    private getUpdatedFields(existingVendor: User, newVendor: VendorDto): Partial<User> {
        const updatedFields: Partial<User> = {};
        if (existingVendor.slNo !== newVendor.slNo) updatedFields.slNo = newVendor.slNo;
        if (existingVendor.name !== newVendor.name) updatedFields.name = newVendor.name;
        if (existingVendor.alias !== newVendor.alias) updatedFields.alias = newVendor.alias;
        if (existingVendor.active !== newVendor.active) updatedFields.active = newVendor.active;
        if (existingVendor.parent !== newVendor.parent) updatedFields.parent = newVendor.parent;
        if (existingVendor.contactPerson !== newVendor.contactPerson) updatedFields.contactPerson = newVendor.contactPerson;
        if (existingVendor.mobile !== newVendor.mobile) updatedFields.mobile = newVendor.mobile;
        if (existingVendor.email !== newVendor.email) updatedFields.email = newVendor.email;
        if (existingVendor.pan !== newVendor.pan) updatedFields.pan = newVendor.pan;
        if (existingVendor.gstType !== newVendor.gstType) updatedFields.gstType = newVendor.gstType;
        if (existingVendor.gstNo !== newVendor.gstNo) updatedFields.gstNo = newVendor.gstNo;
        if (existingVendor.gstDetails !== newVendor.gstDetails) updatedFields.gstDetails = newVendor.gstDetails;

        return updatedFields;
    }

    async findAll(): Promise<User[]> {
        return this.vendorRepository.find(); // Load files for all vendors
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
}
