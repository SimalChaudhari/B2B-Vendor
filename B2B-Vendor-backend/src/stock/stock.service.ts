// stock.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { StockEntity } from './stock.entity';
import { StockDto } from './stock.dto';
import { summary } from 'tally/summary';
import { Cron } from '@nestjs/schedule';
import { SyncLogEntity, SyncLogStatus } from 'sync-log/sync-log.entity';
import { SyncLogService } from 'sync-log/sync-log.service';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockEntity)
    private stockRepository: Repository<StockEntity>,

    @InjectRepository(SyncLogEntity)
    private readonly syncLogRepository: Repository<SyncLogEntity>,
    private readonly syncLogService: SyncLogService,
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
            await this.stockRepository.save({ ...existingStock, ...stock });
          } else {
            console.log(`No changes for stock item: ${stock.itemName}`);
          }
        } else {
          await this.stockRepository.save(stock);
        }
      }
    } catch (error: any) {
      // Handle request timeout error specifically
      if (error.code === 'ECONNABORTED') {
        throw new InternalServerErrorException(
          'Please log in to Tally and try again.'
        );
      }
      // General error handling
      throw new InternalServerErrorException('Open Tally to fetch stock');
    }
  }

  async parseXmlToStockSummaries(xml: string): Promise<StockEntity[]> {
    // Wrap the XML with a root element
    const wrappedXml = `<STOCKSUMMARIES>${xml}</STOCKSUMMARIES>`;

    const parsedResult = await parseStringPromise(wrappedXml);

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
      existingStock.itemName !== newStock.itemName ||
      existingStock.quantity !== newStock.quantity ||
      existingStock.group !== newStock.group ||
      existingStock.subGroup1 !== newStock.subGroup1 ||
      existingStock.quantity !== newStock.quantity


    );
  }

  private cleanString(value: string | undefined): string {
    return value?.replace(/\x04/g, '').trim() || '';
  }

  @Cron('*/60 * * * * *')
  async cronFetchAndStoreItems(): Promise<void> {
    console.log('stocks executed at:', new Date().toISOString());
    const REQUEST_TIMEOUT = 15000; // 15 seconds timeout
    let successCount = 0;
    let failedCount = 0;
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
        try {
          if (existingStock) {
            if (this.hasStockSummaryChanges(existingStock, stock)) {
              await this.stockRepository.save({ ...existingStock, ...stock });
              successCount++;
            } else {
              // console.log(`No changes for stock item: ${stock.itemName}`);
            }
          } else {
            await this.stockRepository.save(stock);
            successCount++;
          }
        } catch (itemError) {
          failedCount++;
        }
      }
      await this.syncLogRepository.save({
        sync_type: 'stocks',
        success_count: successCount,
        failed_count: failedCount,
        total_count: stockSummaries.length,
        status: SyncLogStatus.SUCCESS, // Enum value
      });
    } catch (error: any) {
      failedCount = 1; // Entire operation failed
      await this.syncLogRepository.save({
        sync_type: 'stocks',
        success_count: successCount,
        failed_count: failedCount,
        total_count: 0,
        status: SyncLogStatus.FAIL, // Enum value
      });
      // Handle request timeout error specifically
      if (error.code === 'ECONNABORTED') {
        throw new InternalServerErrorException(
          'Please log in to Tally and try again.'
        );
      }
      // General error handling
      throw new InternalServerErrorException('Open Tally to fetch stock');
    }
  }
}
