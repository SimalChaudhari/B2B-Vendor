import {
    Body,
    Controller,
    HttpStatus,
    Param,
    Put,
    Get,
    Delete,
    Res,
    NotFoundException,
    UseGuards,
    Req,
} from '@nestjs/common';
import { UpdateUserDto, UserRole } from './users.dto';
import { Response } from 'express';
import { UserService } from './users.service';
import { Roles } from 'auth/jwt/roles.decorator';
import { JwtAuthGuard } from 'auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'auth/jwt/roles.guard';
import { Request } from 'express'; 
import { isAdmin } from 'utils/auth.utils';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
    constructor(private userService: UserService) { }

    @Get()
    @Roles(UserRole.Admin)
    async getAllUsers(@Res() response: Response) {
        const users = await this.userService.getAll();
        return response.status(HttpStatus.OK).json({
            length: users.length,
            data: users,
        });
    }

    @Put('update/:id')
    async updateUser(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @Res() response: Response,
        @Req() request: Request,
    ) {
        const user = request.user as { role: UserRole };
        const userRole = user?.role;

        if (!isAdmin(userRole)) {
            const { status, ...otherUpdates } = updateUserDto;
            if (status) {
                throw new NotFoundException('Only admins can update user status');
            }
            updateUserDto = otherUpdates;
        }
        
        const updatedUser = await this.userService.updateUser(id, updateUserDto);
        if (!updatedUser) {
            throw new NotFoundException('User not found');
        }
        return response.status(HttpStatus.OK).json({
            message: "User Successfully Updated",
            data: updatedUser,
        });
    }

    @Get(':id')
    async getUserById(@Param('id') id: string, @Res() response: Response) {
        const user = await this.userService.getById(id);
        return response.status(HttpStatus.OK).json({
            data: user,
        });
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string, @Res() response: Response) {
        const result = await this.userService.delete(id);
        return response.status(HttpStatus.OK).json(result);
    }
}
