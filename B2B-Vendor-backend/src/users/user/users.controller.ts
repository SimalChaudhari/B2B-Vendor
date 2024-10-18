//users.controller.ts
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
    Patch,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import {  UserRole } from './users.dto';
import { Response } from 'express';
import { UserService } from './users.service';
import { Roles } from 'auth/jwt/roles.decorator';
import { JwtAuthGuard } from 'auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'auth/jwt/roles.guard';
import { Request } from 'express'; 
import { isAdmin } from 'utils/auth.utils';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
    constructor(private readonly  userService: UserService) { }
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
}
