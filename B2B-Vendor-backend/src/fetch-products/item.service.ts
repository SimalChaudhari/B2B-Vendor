// product.service.ts
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { parseStringPromise } from 'xml2js'; // Library for parsing XML to JSON
import { ItemEntity } from './item.entity';
import { ItemDto } from './item.dto';
import { FirebaseService } from 'service/firebase.service';
import { products } from 'tally/products';
import { Cron } from '@nestjs/schedule';
import { SyncLogEntity, SyncLogStatus } from 'sync-log/sync-log.entity';
import { SyncLogService } from 'sync-log/sync-log.service';


@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(ItemEntity)
    private itemRepository: Repository<ItemEntity>,
    private firebaseService: FirebaseService, // Inject Firebase service

    @InjectRepository(SyncLogEntity)
    private readonly syncLogRepository: Repository<SyncLogEntity>,
    private readonly syncLogService: SyncLogService,
  ) { }
  async fetchAndStoreItems(): Promise<void> {
    const REQUEST_TIMEOUT = 20000; // 15 seconds timeout
    try {
      // Fetch data from the external source
      const response = await axios.get(process.env.TALLY_URL as string, {
        headers: {
          'Content-Type': 'text/xml',
        },
        data: products, // Replace with your dynamic XML request
        timeout: REQUEST_TIMEOUT, // Set a timeout for the request
      });

      // Parse XML response into items
      const items = await this.parseXmlToItems(response.data);
      // Fetch all existing items from the database
      const existingItems = await this.itemRepository.find();

      // Create a Map of existing items for quick lookup by alias
      const existingItemMap = new Map(existingItems.map(item => [item.alias, item]));

      for (const item of items) {
        const existingItem = existingItemMap.get(item.alias);

        if (existingItem) {
          // If the item exists, compare and update if necessary
          if (this.hasChanges(existingItem, item)) {
            await this.itemRepository.save({ ...existingItem, ...item });
          } else {
            console.log(`No changes for item: ${item.itemName}`);
          }
        } else {
          // If the item does not exist, create a new entry
          console.log(`Adding new item: ${item.itemName}`);
          await this.itemRepository.save(item);
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
      throw new InternalServerErrorException('Open Tally to fetch items');
    }
  }



  async parseXmlToItems(xml: string): Promise<ItemEntity[]> {
    const parsedResult = await parseStringPromise(xml);
    const stockItems = parsedResult.ENVELOPE.STOCKITEM || [];

    return stockItems.map((item: any) => {
      const itemDto = new ItemDto();

      itemDto.itemName = this.cleanString(item.ITEMNAME?.[0]);
      itemDto.alias = this.cleanString(item.ALIAS?.[0]);
      itemDto.partNo = this.cleanString(item.PARTNO?.[0]);
      itemDto.description = this.cleanString(item.DESCRIPTION?.[0]);
      itemDto.group = this.cleanString(item.GROUP?.[0]);
      itemDto.subGroup1 = this.cleanString(item.SUBGROUP1?.[0]);
      itemDto.subGroup2 = this.cleanString(item.SUBGROUP2?.[0]);
      itemDto.baseUnit = this.cleanString(item.BASEUNIT?.[0]);
      itemDto.alternateUnit = this.cleanString(item.ALTERNATEUNIT?.[0]);
      itemDto.conversion = this.cleanString(item.CONVERSION?.[0]);
      itemDto.denominator = parseInt(item.DENOMINATOR?.[0], 10) || 1;
      itemDto.sellingPriceDate = new Date(item.SELLINGPRICEDATE?.[0]);
      itemDto.sellingPrice = parseFloat(item.SELLINGPRICE?.[0]) || 0;
      itemDto.gstApplicable = this.cleanString(item.GSTAPPLICABLE?.[0]);
      itemDto.gstApplicableDate = new Date(item.GSTAPPLICABLEDATE?.[0]);
      itemDto.taxability = this.cleanString(item.TAXABILITY?.[0]);
      itemDto.gstRate = parseFloat(item.GSTRATE?.[0]) || 0;

      // Convert DTO to Entity
      return this.itemRepository.create(itemDto);
    });

  }

  private cleanString(value: string | undefined): string {
    return value?.replace(/\x04/g, '').trim() || '';
  }

  // Function to check if the existing product has changes
  private hasChanges(existingProduct: ItemEntity, newItem: ItemEntity): boolean {
    return (
      existingProduct.itemName !== newItem.itemName ||
      existingProduct.partNo !== newItem.partNo ||
      existingProduct.description !== newItem.description ||
      existingProduct.group !== newItem.group ||
      existingProduct.subGroup1 !== newItem.subGroup1 ||
      existingProduct.subGroup2 !== newItem.subGroup2 ||
      existingProduct.baseUnit !== newItem.baseUnit ||
      existingProduct.alternateUnit !== newItem.alternateUnit ||
      existingProduct.conversion !== newItem.conversion ||
      existingProduct.denominator !== newItem.denominator ||
      existingProduct.sellingPriceDate.getTime() !== newItem.sellingPriceDate.getTime() || // For dates, compare using getTime()
      existingProduct.sellingPrice !== newItem.sellingPrice ||
      existingProduct.gstApplicable !== newItem.gstApplicable ||
      existingProduct.gstApplicableDate.getTime() !== newItem.gstApplicableDate.getTime() ||
      existingProduct.taxability !== newItem.taxability ||
      existingProduct.gstRate !== newItem.gstRate
    );
  }



  async findAll(): Promise<ItemEntity[]> {
    return this.itemRepository.find(); // Load files for all items
  }

  async findById(id: string): Promise<ItemEntity | null> {
    return this.itemRepository.findOne({ where: { id } }); // Load files for the item by ID
  }


  async delete(id: string): Promise<{ message: string }> {
    const items = await this.findById(id);
    // Check if the item exists
    if (!items) {
      throw new NotFoundException(`Item with id ${id} not found`); // or handle it differently
    }
    await this.itemRepository.remove(items);
    return { message: 'Product deleted successfully' };
  }


  async uploadFilesToFirebase(
    itemId: string,
    productImages: Express.Multer.File[],
    dimensionalFiles: Express.Multer.File[],
    applyToAllProductImages: boolean,
    applyToAllDimensionalFiles: boolean
  ): Promise<ItemEntity[]> {
    // Find the specific item by ID
    const item = await this.itemRepository.findOne({ where: { id: itemId } });
    if (!item) {
      throw new NotFoundException('Item not found');
    }

    // Initialize lists to store new image URLs
    const newImageUrls: string[] = [];
    const newDimensionalUrls: string[] = [];

    // Array to collect all updated items
    const updatedItems: ItemEntity[] = [];

    // Upload product images if provided
    if (productImages && productImages.length > 0) {
      for (const file of productImages) {
        const filePath = `images/${Date.now()}-${file.originalname}`;
        const imageUrl = await this.firebaseService.uploadFile(filePath, file.buffer);
        newImageUrls.push(imageUrl);
      }
    }

    // Upload dimensional files if provided
    if (dimensionalFiles && dimensionalFiles.length > 0) {
      for (const file of dimensionalFiles) {
        const filePath = `documents/${Date.now()}-${file.originalname}`;
        const fileUrl = await this.firebaseService.uploadFile(filePath, file.buffer);
        newDimensionalUrls.push(fileUrl);
      }
    }

    // Define items to update
    let itemsToUpdate: ItemEntity[];

    if (applyToAllProductImages || applyToAllDimensionalFiles) {
      // Fetch all items with the same subGroup1 if any applyToAll flag is true
      itemsToUpdate = await this.itemRepository.find({ where: { subGroup2: item.subGroup2 } });

      for (const currentItem of itemsToUpdate) {
        // Apply new images to all items in the subgroup if applyToAllProductImages is true
        if (applyToAllProductImages) {
          currentItem.productImages = [...(item.productImages || []), ...newImageUrls]; // Replace with combined images from specified item
        }

        // Apply new dimensional files to all items in the subgroup if applyToAllDimensionalFiles is true
        if (applyToAllDimensionalFiles) {
          currentItem.dimensionalFiles = [...(item.dimensionalFiles || []), ...newDimensionalUrls]; // Replace with combined dimensional files from specified item
        }

        // Save each updated item
        const savedItem = await this.itemRepository.save(currentItem);
        updatedItems.push(savedItem);
      }
    } else {
      // Only update the specified item if no applyToAll flag is true
      if (newImageUrls.length > 0) {
        item.productImages = [...(item.productImages || []), ...newImageUrls];
      }

      if (newDimensionalUrls.length > 0) {
        item.dimensionalFiles = [...(item.dimensionalFiles || []), ...newDimensionalUrls];
      }

      // Save the specified item
      const savedItem = await this.itemRepository.save(item);
      updatedItems.push(savedItem);
    }

    return updatedItems; // Return the list of updated items
  }




  // Method to delete specific images from Firebase
  async deleteImages(itemId: string, imagesToDelete: { productImages?: string[]; dimensionalFiles?: string[] }): Promise<ItemEntity> {
    const item = await this.itemRepository.findOne({ where: { id: itemId } });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    // Delete specified product images from Firebase if URLs are provided
    const productImages = imagesToDelete.productImages;
    if (productImages?.length) {
      // await this.firebaseService.deleteImage(productImages);
      // Remove deleted product image URLs from the item
      item.productImages = item.productImages.filter(url => !productImages.includes(url));
    }

    // Delete specified dimensional files from Firebase if URLs are provided
    const dimensionalFiles = imagesToDelete.dimensionalFiles;
    if (dimensionalFiles?.length) {
      // await this.firebaseService.deleteImage(dimensionalFiles);
      // Remove deleted dimensional file URLs from the item
      item.dimensionalFiles = item.dimensionalFiles.filter(url => !dimensionalFiles.includes(url));
    }

    return await this.itemRepository.save(item); // Save the updated item entity
  }

  async deleteMultiple(ids: string[]): Promise<{ message: string }> {
    const notFoundIds: string[] = [];

    for (const id of ids) {
      const item = await this.findById(id);
      if (!item) {
        notFoundIds.push(id);
        continue; // skip this ID if not found
      }
      await this.itemRepository.remove(item);
    }

    if (notFoundIds.length > 0) {
      throw new NotFoundException(`Items with ids ${notFoundIds.join(', ')} not found`);
    }

    return { message: 'Products deleted successfully' };
  }


  //Cron Job Set

  @Cron('*/60 * * * * *') // Runs every 60 seconds
  async cronFetchAndStoreItems(): Promise<void> {
    console.log('Item executed at:', new Date().toISOString());
    const REQUEST_TIMEOUT = 20000; // 20 seconds timeout

    let successCount = 0;
    let failedCount = 0;

    try {
      const response = await axios.get(process.env.TALLY_URL as string, {
        headers: {
          'Content-Type': 'text/xml',
        },
        data: products,
        timeout: REQUEST_TIMEOUT,
      });

      const items = await this.parseXmlToItems(response.data);
      const existingItems = await this.itemRepository.find();

      const existingItemMap = new Map(existingItems.map(item => [item.alias, item]));

      for (const item of items) {
        const existingItem = existingItemMap.get(item.alias);
        try {
          if (existingItem) {
            if (this.hasChanges(existingItem, item)) {
              await this.itemRepository.save({ ...existingItem, ...item });
              successCount++;
            } else {
              console.log(`No changes for item: ${item.itemName}`);
            }
          } else {
            await this.itemRepository.save(item);
            successCount++;
          }
        } catch (itemError) {
          failedCount++;
        }
      }

      await this.syncLogRepository.save({
        sync_type: 'items',
        success_count: successCount,
        failed_count: failedCount,
        total_count: items.length,
        status: SyncLogStatus.SUCCESS, // Enum value
      });

    } catch (error: any) {
      failedCount = 1; // Entire operation failed

      await this.syncLogRepository.save({
        sync_type: 'items',
        success_count: successCount,
        failed_count: failedCount,
        total_count: 0,
        status: SyncLogStatus.FAIL, // Enum value
      });

      throw new InternalServerErrorException('Open Tally to fetch items');
    }
  }

  // @Cron('*/60 * * * * *')
  // async cronFetchAndStoreItems(): Promise<void> {
  //   console.log('Item sync executed at:', new Date().toISOString());
  //   await this.syncLogService.fetchAndStoreData(
  //     process.env.TALLY_URL as string,
  //     products, // XML payload for items
  //     this.parseXmlToItems.bind(this), // XML parsing function for items
  //     this.itemRepository,
  //     'item',
  //     'items',
  //     this.syncLogRepository
  //   );
  // }

  @Cron('0 0 * * 0') // Runs weekly at midnight on Sunday to delete logs older than two minutes.
  async cleanupAllLogs(): Promise<void> {
    console.log('Complete log cleanup started:', new Date().toISOString());

    try {
      // Delete all logs without any condition
      const result = await this.syncLogRepository.delete({});

      console.log(`Complete log cleanup completed. Deleted ${result.affected} logs.`);
    } catch (error) {
      console.error('Complete log cleanup failed:', error);
    }
  }



}