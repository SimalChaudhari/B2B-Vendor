import { Controller, HttpStatus, Post, Get, Res } from '@nestjs/common';
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

}
