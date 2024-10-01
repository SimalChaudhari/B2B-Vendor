import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAddressDto, UpdateAddressDto } from './addresses.dto';
import { Address } from './addresses.entity';

@Injectable()
export class AddressesService {
    constructor(
        @InjectRepository(Address)
        private addressesRepository: Repository<Address>,
    ) { }

    async getAll(): Promise<Address[]> {
        const address = await this.addressesRepository.find();
        return address
    }

    async create(createAddressDto: CreateAddressDto, userId: string): Promise<Address> {
        // Create a new address instance
        const address = this.addressesRepository.create(createAddressDto);
        address.user_id = userId;  // Assuming user_id is the correct property name on the Address entity
        return this.addressesRepository.save(address);
    }

    async getById(id: string): Promise<Address> {
        const address = await this.addressesRepository.findOne({ where: { id } }); // Correct way to find by ID
        if (!address) {
            throw new NotFoundException('Address not found');
        }
        return address;
    }

    async update(id: string, updateAddressDto: UpdateAddressDto): Promise<Address> {
        const address = await this.getById(id);
        Object.assign(address, updateAddressDto);
        return this.addressesRepository.save(address);
    }

    async delete(id: string): Promise<{ message: string }> {
        const address = await this.getById(id);
        await this.addressesRepository.remove(address);
        return { message: 'Address deleted successfully' };
    }
}
