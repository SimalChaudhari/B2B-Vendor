// stock.controller.ts
import { Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { StockService } from './stock.service';
import { Response } from 'express'; // Import Response from express

@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('/fetch-summary')
  async fetchStockSummary() {
    await this.stockService.fetchAndStoreStockSummary();
    return { message: 'Stock summary fetched and stored successfully' };
  }

  @Get() // Get all items
  async findAll(@Res() response: Response) {
    const stock = await this.stockService.findAll();
    return response.status(HttpStatus.OK).json({
      length: stock.length,
      data: stock,
    });
  }
}
