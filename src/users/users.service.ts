import { Injectable, NotFoundException } from '@nestjs/common';
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
        return await this.userRepository.find();
    }

    // Update the method to accept an optional file parameter
    async updateUser(id: string, updateUserDto: UpdateUserDto, file?: Express.Multer.File): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        // Handle file upload if a file is provided
        if (file) {
            // Define where to save the uploaded file
            const uploadPath = path.join(__dirname, '..', '..', 'src', 'uploads', file.originalname);
            fs.writeFileSync(uploadPath, file.buffer); // Save the file (you may want to do this asynchronously)
            user.profile = uploadPath; // Assume you have a field in your User entity for the image path
        }

        Object.assign(user, updateUserDto);
        return await this.userRepository.save(user);
    }
    async getById(id: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } }); // Correct way to find by ID
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async delete(id: string): Promise<{ message: string }> {
        const user = await this.userRepository.findOne({ where: { id } }); // Correct way to find by ID
        if (!user) {
            throw new NotFoundException('User not found');
        }
        await this.userRepository.remove(user);
        return { message: 'User deleted successfully' };
    }
}
