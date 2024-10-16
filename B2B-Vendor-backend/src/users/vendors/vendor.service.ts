import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { parseStringPromise } from 'xml2js'; // Library for parsing XML to JSON
import { VendorEntity } from './vendor.entity'; // Make sure to import your Vendor Entity
import { VendorDto } from './vendor.dto'; // Make sure to import your Vendor DTO
import { Vendors } from 'tally/vendors';

@Injectable()
export class VendorService {
    constructor(
        @InjectRepository(VendorEntity)
        private vendorRepository: Repository<VendorEntity>,
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
                    // If the Vendor exists, compare and update if necessary
                    if (this.hasChanges(existingVendor, vendor)) {
                        await this.vendorRepository.save(vendor);
                    } else {
                        console.log(`No changes for vendor: ${vendor.name}`);
                    }
                } else {
                    // If the vendor does not exist, create a new entry
                    await this.vendorRepository.save(vendor);
                }
            }

        } catch (error) {
            console.log("🚀 ~ VendorService ~ fetchAndStoreVendors ~ error:", error)
            throw new InternalServerErrorException('Failed to fetch vendors');
        }
    }

    async parseXmlToVendors(xml: string): Promise<VendorEntity[]> {
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
            vendorDto.phone = this.cleanString(vendor.PHONE?.[0]);
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
    private hasChanges(existingVendor: VendorEntity, newVendor: VendorEntity): boolean {
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
            existingVendor.phone !== newVendor.phone ||
            existingVendor.email !== newVendor.email ||
            existingVendor.pan !== newVendor.pan ||
            existingVendor.gstType !== newVendor.gstType ||
            existingVendor.gstNo !== newVendor.gstNo ||
            existingVendor.gstDetails !== newVendor.gstDetails
        );
    }

    async findAll(): Promise<VendorEntity[]> {
        return this.vendorRepository.find(); // Load files for all vendors
    }

    async findById(id: string): Promise<VendorEntity | null> {
        return this.vendorRepository.findOne({ where: { id } }); // Load files for the vendor by ID
    }
}
