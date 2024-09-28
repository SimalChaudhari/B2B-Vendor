//users.service.ts
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './users.dto';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async getAll(): Promise<User[]> {
        const users = await this.userRepository.find({ where: { isDeleted: false } });
        if (users.length === 0) {
            throw new NotFoundException('No data available');
        }
        return users;
    }

    // Update the method to accept an optional file parameter
    async updateUser(id: string, updateUserDto: UpdateUserDto, file?: Express.Multer.File): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id, isDeleted: false } });
        if (!user) {
            throw new NotFoundException('User not found or has been deleted');
        }
        // Check for existing email and mobile number
        const conflictUser = await this.userRepository.findOne({
            where: [
                { email: updateUserDto.email},
                { mobile: updateUserDto.mobile},
            ]
        });
        if (conflictUser && conflictUser.id !== user.id) {
            throw new ConflictException(`${conflictUser.email === updateUserDto.email ? 'Email' : 'Mobile number'} already exists`);
        }

        if (file) {
            const uploadPath = path.join(__dirname, '..', '..', '..', 'src', 'uploads', file.originalname);
            fs.writeFileSync(uploadPath, file.buffer); // Save the file (you may want to do this asynchronously)
            user.profile = uploadPath; // Assume you have a field in your User entity for the image path
        }
        Object.assign(user, updateUserDto);
        return await this.userRepository.save(user);
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
