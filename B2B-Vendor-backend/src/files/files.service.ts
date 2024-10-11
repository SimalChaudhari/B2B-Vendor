// src/files/file.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './file.entity';

import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from 'service/firebase.service';
import { UploadFileDto } from './upload-file.dto';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,

    private readonly firebaseService: FirebaseService, // Inject Firebase service
  ) {}

  async uploadFiles(
    uploadFileDto: UploadFileDto,
    productImages: Express.Multer.File[],
    dimensionalFileFiles: Express.Multer.File[],
  ): Promise<File> {
    const { itemId } = uploadFileDto;

    // Create a new File entry
    const file = this.fileRepository.create({ itemId });

    // Upload product images to Firebase
    if (productImages && productImages.length > 0) {
      const productImageUrls = await Promise.all(
        productImages.map(async (file) => {
          return this.firebaseService.uploadFile(
            `productImages/${itemId}/image_${file.originalname}`, // Use original name for uniqueness
            file.buffer, // Use the buffer from uploaded file
          );
        }),
      );
      file.productImage = productImageUrls.join(', '); // Store URLs as a comma-separated string
    }

    // Upload dimensional files to Firebase
    if (dimensionalFileFiles && dimensionalFileFiles.length > 0) {
      const dimensionalFileUrls = await Promise.all(
        dimensionalFileFiles.map(async (file) => {
          return this.firebaseService.uploadFile(
            `dimensionalFiles/${itemId}/dimensionalFile_${file.originalname}`, // Use original name for uniqueness
            file.buffer, // Use the buffer from uploaded file
          );
        }),
      );
      file.dimensionalFile = dimensionalFileUrls.join(', '); // Store URLs as a comma-separated string
    }

    // Save the file entry in the database
    const savedFile = await this.fileRepository.save(file);
    return savedFile; // Return the saved File entity
  }
}
