// src/files/file.controller.ts
import { Controller, Post, Body, UseInterceptors, UploadedFiles } from '@nestjs/common';
// import { FileService } from './file.service';
// import { UploadFileDto } from './dto/upload-file.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileService } from './files.service';
import { UploadFileDto } from './upload-file.dto';

@Controller('files')
export class FileController {
    constructor(private readonly fileService: FileService) { }

    @Post('upload')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'productImages', maxCount: 10 }, // Adjust maxCount as needed
            { name: 'dimensionalFiles', maxCount: 10 }, // Adjust maxCount as needed
        ]),
    )
    async uploadFile(
        @Body() uploadFileDto: UploadFileDto,
        @UploadedFiles() files: { productImages?: Express.Multer.File[], dimensionalFiles?: Express.Multer.File[] },
    ) {
        // Provide default values to avoid undefined
        const productImages = files.productImages || [];
        const dimensionalFiles = files.dimensionalFiles || [];

        return this.fileService.uploadFiles(uploadFileDto, productImages, dimensionalFiles);
    }
}