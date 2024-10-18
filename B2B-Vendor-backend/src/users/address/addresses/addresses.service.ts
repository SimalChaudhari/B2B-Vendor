import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAddressDto, UpdateAddressDto } from './addresses.dto';
import { Address } from './addresses.entity';
import { User } from 'users/user/users.entity';

@Injectable()
export class AddressesService {
    constructor(
        @InjectRepository(Address)
        private addressesRepository: Repository<Address>,

        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async getAll(): Promise<Address[]> {
        const address = await this.addressesRepository.find();
        return address
    }

    async create(createAddressDto: CreateAddressDto, userId: string): Promise<Address> {
        // Fetch the user entity by userId
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new Error('User not found');
        }

        // Create a new address instance
        const address = this.addressesRepository.create(createAddressDto);

        // Assign the fetched user entity to the user field
        // address.user = user;

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
