// stock.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { StockEntity } from './stock.entity';
import { StockDto } from './stock.dto';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockEntity)
    private stockRepository: Repository<StockEntity>,
  ) {}

  async findAll(): Promise<StockEntity[]> {
    return this.stockRepository.find(); // Load files for all items
  }


  async fetchAndStoreStockSummary(): Promise<void> {
    try {
      const response = await axios.get(process.env.TALLY_STOCK_SUMMARY_URL as string, {
        headers: {
          'Content-Type': 'text/xml',
        },
      });

      const stockSummaries = await this.parseXmlToStockSummaries(response.data);
      const existingStocks = await this.stockRepository.find();

      const existingStockMap = new Map(existingStocks.map(stock => [stock.itemName, stock]));

      for (const stock of stockSummaries) {
        const existingStock = existingStockMap.get(stock.itemName);

        if (existingStock) {
          if (this.hasStockSummaryChanges(existingStock, stock)) {
            await this.stockRepository.save(stock);
          } else {
            console.log(`No changes for stock item: ${stock.itemName}`);
          }
        } else {
          await this.stockRepository.save(stock);
        }
      }
    } catch (error) {
      throw new InternalServerErrorException('Error fetching stock summary from Tally');
    }
  }

  async parseXmlToStockSummaries(xml: string): Promise<StockEntity[]> {
    const parsedResult = await parseStringPromise(xml);
    const stockSummaryItems = parsedResult.ENVELOPE.STOCKSUMMARYITEM || [];

    return stockSummaryItems.map((item: any) => {
      const stockDto = new StockDto();

      stockDto.itemName = this.cleanString(item.ITEMNAME?.[0]);
      stockDto.group = this.cleanString(item.GROUP?.[0]);
      stockDto.subGroup1 = this.cleanString(item.SUBGROUP1?.[0]);
      stockDto.subGroup2 = this.cleanString(item.SUBGROUP2?.[0]);
      stockDto.quantity = this.cleanString(item.QUANTITY?.[0] || '0');
      stockDto.rate = this.cleanString(item.RATE?.[0] || '0');
      stockDto.amount = this.cleanString(item.AMOUNT?.[0] || '0');

      return this.stockRepository.create(stockDto);
    });
  }

  private hasStockSummaryChanges(existingStock: StockEntity, newStock: StockEntity): boolean {
    return (
      existingStock.quantity !== newStock.quantity ||
      existingStock.rate !== newStock.rate ||
      existingStock.amount !== newStock.amount
    );
  }

  private cleanString(value: string | undefined): string {
    return value?.replace(/\x04/g, '').trim() || '';
  }
}
