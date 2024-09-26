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
import { UpdateUserDto, UserRole } from './users.dto';
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
    @Patch('update/:id')
    @UseInterceptors(FileInterceptor('profile')) // Use 'image' as the field name for the uploaded file
    async updateUser(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @Res() response: Response,
        @Req() request: Request,
        @UploadedFile() file?: Express.Multer.File // This will hold the uploaded file, but it's optional
    ) {
        const user = request.user as { role: UserRole };
        const userRole = user?.role;
    
        if (!isAdmin(userRole)) {
            const { status, ...otherUpdates } = updateUserDto;
            if (status) {
                throw new NotFoundException('Only admins can update user status');
            }
            updateUserDto = otherUpdates; // Only non-status fields are allowed for non-admins
        }
        const updatedUser = await this.userService.updateUser(id, updateUserDto,file);
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
