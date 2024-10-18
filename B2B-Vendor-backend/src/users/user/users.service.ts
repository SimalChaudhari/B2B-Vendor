//users.service.ts
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Address } from 'users/address/addresses/addresses.entity';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Address)
        private addressRepository: Repository<Address>,
    ) { }

    async getAll(): Promise<User[]> {
        return await this.userRepository.find({
          where: { isDeleted: false },
          relations: ['addresses'], // Ensure addresses are loaded
        });
      }


    async getById(id: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id, isDeleted: false } }); // Correct way to find by ID
        if (!user) {
            throw new NotFoundException("User not found or has been deleted");
        }
        return user;
    }

    async delete(id: string): Promise<{ message: string }> {
        const user = await this.userRepository.findOne({ where: { id } }); // Correct way to find by ID
        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.isDeleted = true;
        await this.userRepository.save(user);
        // await this.userRepository.remove(user);
        return { message: 'User deleted successfully' };
    }
}
