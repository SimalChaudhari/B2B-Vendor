// // src/files/file.controller.ts
// import { Controller, Post, Body, UseInterceptors, UploadedFiles, Get, Param, Res, HttpStatus } from '@nestjs/common';
// import { Response } from 'express'; // Import Response from 'express'
// // import { FileService } from './file.service';
// // import { UploadFileDto } from './dto/upload-file.dto';
// import { FileFieldsInterceptor } from '@nestjs/platform-express';
// import { FileService } from './files.service';
// import { UploadFileDto } from './upload-file.dto';

// @Controller('files')
// export class FileController {
//     constructor(private readonly fileService: FileService) { }

//     @Post('upload')
//     @UseInterceptors(
//         FileFieldsInterceptor([
//             { name: 'productImages', maxCount: 10 },
//             { name: 'dimensionalFiles', maxCount: 10 },
//         ]),
//     )
//     async uploadFile(
//         @Body() uploadFileDto: UploadFileDto,
//         @UploadedFiles() files: { productImages?: Express.Multer.File[], dimensionalFiles?: Express.Multer.File[] },
//     ) {
//         // Provide default values to avoid undefined
//         const productImages = files.productImages || [];
//         const dimensionalFiles = files.dimensionalFiles || [];

//         return this.fileService.uploadFiles(uploadFileDto, productImages, dimensionalFiles);
//     }

//     // @Get() // Get all items
//     @Get()
//     async getAllFiles(@Res() response: Response) {
//         const files = await this.fileService.getAllFiles();

//         // Return the custom response
//         return response.status(HttpStatus.OK).json({
//             length: files.length,
//             data: files,
//         });
//     }
//     // Add a route to get file by ID
//     // @Get(':id')
//     // async getFileById(@Param('id') id: number): Promise<File> {
//     //     const file = await this.fileService.getFileById(id);
//     //     if (!file) {
//     //         throw new NotFoundException(`File with ID ${id} not found`);
//     //     }
//     //     return file;
//     // }
// }
