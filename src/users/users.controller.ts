import {
    Body,
    Controller,
    HttpStatus,
    Param,
    Put,
    Get, Delete,
    Res,
    NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './users.dto'; // Adjust the import path as necessary
import { Response } from 'express';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Get()
    async getAllUsers(
        @Res() response: Response,
    ) {
        const users = await this.userService.getAll();
        return response.status(HttpStatus.OK).json({
            length: users.length, // Include length of the users array
            data: users, // Include user data
        });
    }

    @Put('update/:id')
    async updateUser(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @Res() response: Response,
    ) {
        const updatedUser = await this.userService.updateUser(id, updateUserDto);
        if (!updatedUser) {
            throw new NotFoundException('User not found');
        }
        return response.status(HttpStatus.OK).json({
            message: "User Successfully Updated", // Include length of the users array
            data: updatedUser, // Include user data
        });
    }

    @Get(':id')
    async getUserById(
        @Param('id') id: string,
        @Res() response: Response,
    ) {
        const user = await this.userService.getById(id);
        return response.status(HttpStatus.OK).json({
            data: user
        });
    }

    @Delete(':id')
    async deleteUser(
        @Param('id') id: string,
        @Res() response: Response,
    ) {
        const result = await this.userService.delete(id);
        return response.status(HttpStatus.OK).json(result);
    }
    
}
