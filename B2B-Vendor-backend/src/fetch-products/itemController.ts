// Item.controller.ts
import { Controller, Post } from '@nestjs/common';
import { ItemService } from './item.service';


@Controller('items')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Post('/fetch')
  async fetchItems() {
    await this.itemService.fetchAndStoreItems();
    return { message: 'Item fetched and stored successfully' };
  }
}
