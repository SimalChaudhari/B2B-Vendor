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


@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(ItemEntity)
    private itemRepository: Repository<ItemEntity>,
    private firebaseService: FirebaseService, // Inject Firebase service
  ) { }

  async fetchAndStoreItems(): Promise<void> {
    const REQUEST_TIMEOUT = 15000; // 15 seconds timeout
    try {
      const response = await axios.get(process.env.TALLY_URL as string, {
        headers: {
          'Content-Type': 'text/xml',
        },
        data: products, // Replace with your dynamic XML request
        timeout: REQUEST_TIMEOUT, // Set a timeout for the request
      });
   
      const items = await this.parseXmlToItems(response.data);
      const existingItems = await this.itemRepository.find();

      // Create a map of existing  items for quick lookup
      const existingItemMap = new Map(existingItems.map(item => [item.alias, item]));

      for (const item of items) {
        const existingItem = existingItemMap.get(item.alias);

        if (existingItem) {
          // If the Item exists, compare and update if necessary
          if (this.hasChanges(existingItem, item)) {
            await this.itemRepository.save(item);
          } else {
            console.log(`No changes for item: ${item.itemName}`);
          }
        } else {
          // If the item does not exist, create a new entry
          await this.itemRepository.save(item);
        }
      }

    } catch (error:any) {
       // Handle request timeout error specifically
       if (error.code === 'ECONNABORTED') {
        throw new InternalServerErrorException(
            'Please log in to Tally and try again.'
        );
    }
      throw new InternalServerErrorException('Open Tally to fetch items');
      // throw new Error('Failed to fetch items.please ensure Tally is open and try again.');
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
    dimensionalFiles: Express.Multer.File[]
  ): Promise<ItemEntity> {
    const item = await this.itemRepository.findOne({ where: { id: itemId } });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    // Update only product images if new files are provided
    if (productImages && productImages.length > 0) {
      const newImageUrls: string[] = []; // Array to hold newly uploaded image URLs

      for (const file of productImages) {
        const filePath = `images/${Date.now()}-${file.originalname}`;
        const imageUrl = await this.firebaseService.uploadFile(filePath, file.buffer);
        newImageUrls.push(imageUrl); // Collect the uploaded image URL
      }

      // Update the item entity with the new image URLs
      item.productImages = [...(item.productImages || []), ...newImageUrls]; // Append new image URLs
    }

    // Update only dimensional files if new files are provided
    if (dimensionalFiles && dimensionalFiles.length > 0) {
      const newDimensionalUrls: string[] = []; // Array to hold newly uploaded dimensional URLs

      for (const file of dimensionalFiles) {
        const filePath = `documents/${Date.now()}-${file.originalname}`;
        const fileUrl = await this.firebaseService.uploadFile(filePath, file.buffer);
        newDimensionalUrls.push(fileUrl); // Collect new dimensional URLs
      }

      // Update dimensionalFiles only if new dimensional files are uploaded
      item.dimensionalFiles = newDimensionalUrls; // Set to only the newly uploaded dimensional files
    }

    return await this.itemRepository.save(item); // Save the updated item entity
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
      await this.firebaseService.deleteFiles(productImages);
      // Remove deleted product image URLs from the item
      item.productImages = item.productImages.filter(url => !productImages.includes(url));
    }

    // Delete specified dimensional files from Firebase if URLs are provided
    const dimensionalFiles = imagesToDelete.dimensionalFiles;
    if (dimensionalFiles?.length) {
      await this.firebaseService.deleteFiles(dimensionalFiles);
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



}