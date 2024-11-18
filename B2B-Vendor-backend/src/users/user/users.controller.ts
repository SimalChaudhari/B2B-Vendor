//users.controller.ts
import {
    Controller,
    HttpStatus,
    Param,
    Get,
    Delete,
    Res,
    UseGuards,
    Patch,
    Body,
} from '@nestjs/common';
import { UserRole } from './users.dto';
import { Response } from 'express';
import { UserService } from './users.service';
import { Roles } from 'auth/jwt/roles.decorator';
import { JwtAuthGuard } from 'auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'auth/jwt/roles.guard';
import { UserStatus } from './users.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }
    @Get()
    @Roles(UserRole.Admin)
    async getAllUsers(@Res() response: Response) {
        const users = await this.userService.getAll();
        return response.status(HttpStatus.OK).json({
            length: users.length,
            data: users,
        });
    }


    @Get(':id')
    async getUserById(@Param('id') id: string, @Res() response: Response) {
        const user = await this.userService.getById(id);
        return response.status(HttpStatus.OK).json({
            data: user,
        });
    }

    @Delete('delete/:id')
    async deleteUser(@Param('id') id: string, @Res() response: Response) {
        const result = await this.userService.delete(id);
        return response.status(HttpStatus.OK).json(result);
    }

    @Patch('status/:id')
    @Roles(UserRole.Admin)
    async updateUserStatus(
        @Param('id') id: string,
        @Body('status') status: UserStatus,
        @Res() response: Response,
    ) {
        const updatedUser = await this.userService.updateUserStatus(id, status);
        return response.status(HttpStatus.OK).json({
            message: `User status updated to ${status}`,
            data: updatedUser,
        });
    }


}
