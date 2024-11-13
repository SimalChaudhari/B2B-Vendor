// stock.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { StockEntity } from './stock.entity';
import { StockDto } from './stock.dto';
import { summary } from 'tally/summary';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockEntity)
    private stockRepository: Repository<StockEntity>,
  ) { }

  async findAll(): Promise<StockEntity[]> {
    return this.stockRepository.find(); // Load files for all items
  }


  async fetchAndStoreStockSummary(): Promise<void> {
    const REQUEST_TIMEOUT = 15000; // 15 seconds timeout

    try {
      const response = await axios.get(process.env.TALLY_URL as string, {
        headers: {
          'Content-Type': 'text/xml',
        },
        data: summary, // Replace with your dynamic XML request
        timeout: REQUEST_TIMEOUT, // Set a timeout for the request
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
    // Wrap the XML with a root element
    const wrappedXml = `<STOCKSUMMARIES>${xml}</STOCKSUMMARIES>`;
    
    const parsedResult = await parseStringPromise(wrappedXml);
    console.log("🚀 ~ StockService ~ parseXmlToStockSummaries ~ parsedResult:", parsedResult);

    // Access STOCKSUMMARIES.STOCKSUMMARY as an array
    const stockSummaryItems = parsedResult.STOCKSUMMARIES?.STOCKSUMMARY || [];

    return stockSummaryItems.map((item: any) => {
        const stockDto = new StockDto();

        stockDto.itemName = this.cleanString(item.ITEMNAME?.[0] || '');
        stockDto.group = this.cleanString(item.GROUP?.[0] || '');
        stockDto.subGroup1 = this.cleanString(item.SUBGROUP1?.[0] || '');
        stockDto.subGroup2 = this.cleanString(item.SUBGROUP2?.[0] || '');
        stockDto.quantity = (parseFloat(item.CLOSINGSTOCK?.[0] || '0')).toString();

        return this.stockRepository.create(stockDto);
    });
}




  private hasStockSummaryChanges(existingStock: StockEntity, newStock: StockEntity): boolean {
    return (
      existingStock.quantity !== newStock.quantity
    );
  }

  private cleanString(value: string | undefined): string {
    return value?.replace(/\x04/g, '').trim() || '';
  }
}
