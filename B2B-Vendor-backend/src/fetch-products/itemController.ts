import { Controller, HttpStatus, Post, Get, Res, Param, UploadedFiles, UseInterceptors, BadRequestException, Delete, Body } from '@nestjs/common';
import { Response } from 'express'; // Import Response from express
import { ItemService } from './item.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ItemEntity } from './item.entity';

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) { }

  @Post('/fetch')
  async fetchItems() {
    await this.itemService.fetchAndStoreItems();
    return { message: 'Items fetched and stored successfully' };
  }

  @Get() // Get all items
  async findAll(@Res() response: Response) {
    const items = await this.itemService.findAll();
    return response.status(HttpStatus.OK).json({
      length: items.length,
      data: items,
    });
  }

  @Get('get/:id') // Get item by ID
  async getById(@Param('id') id: string, @Res() response: Response) {
    const item = await this.itemService.findById(id);
    if (!item) {
      return response.status(HttpStatus.NOT_FOUND).json({
        message: 'Item not found',
      });
    }
    return response.status(HttpStatus.OK).json({
      data: item,
    });
  }

  @Post('/upload-files/:id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'productImages', maxCount: 10 },
    { name: 'dimensionalFiles', maxCount: 10 },
  ]))
  async uploadFiles(
    @Param('id') id: string,
    @UploadedFiles() files: { productImages?: Express.Multer.File[]; dimensionalFiles?: Express.Multer.File[] }
  ) {
    // Provide default empty arrays if undefined
    const productImages: Express.Multer.File[] = files.productImages || [];
    const dimensionalFiles: Express.Multer.File[] = files.dimensionalFiles || [];

    return this.itemService.uploadFilesToFirebase(id, productImages, dimensionalFiles);
  }

@Delete('delete/:id')
async deleteImages(
  @Param('id') itemId: string, 
  @Body() imagesToDelete: { productImages?: string[]; dimensionalFiles?: string[] }
): Promise<ItemEntity> {
  return this.itemService.deleteImages(itemId, imagesToDelete);
}
}