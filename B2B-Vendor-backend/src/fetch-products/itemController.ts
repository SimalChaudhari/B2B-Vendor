import { Controller, HttpStatus, Post, Get, Res, Param } from '@nestjs/common';
import { Response } from 'express'; // Import Response from express
import { ItemService } from './item.service';

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post('/fetch')
  async fetchItems() {
    await this.itemService.fetchAndStoreItems();
    return { message: 'Items fetched and stored successfully' };
  }

  @Get() // This should be decorated with @Get
  async findAll(@Res() response: Response) {
    const items = await this.itemService.findAll();
    return response.status(HttpStatus.OK).json({
      length: items.length,
      data: items,
    });
  }

  @Get('get/:id') // Get item by ID
  async getById(@Param('id') id: string, @Res() response: Response) {
      const item = await this.itemService.findById(id); // Implement findById in your service
      if (!item) {
          return response.status(HttpStatus.NOT_FOUND).json({
              message: 'Item not found',
          });
      }
      return response.status(HttpStatus.OK).json({
          data: item,
      });
  }

}
