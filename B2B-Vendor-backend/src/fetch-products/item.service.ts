// product.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { parseStringPromise } from 'xml2js'; // Library for parsing XML to JSON
import { ItemEntity } from './item.entity';
import { ItemDto } from './item.dto';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebase.config'; // Import Firebase storage

const data = `
<ENVELOPE>
<HEADER>
  <TALLYREQUEST>Export Data</TALLYREQUEST>
</HEADER>
<BODY>
  <EXPORTDATA>
    <REQUESTDESC>
      <STATICVARIABLES> 
        <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
      </STATICVARIABLES>
      <REPORTNAME>Item Address Book</REPORTNAME>
    </REQUESTDESC>
  </EXPORTDATA>
</BODY>
</ENVELOPE>
`

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(ItemEntity)
    private itemRepository: Repository<ItemEntity>,
  ) { }

  async fetchAndStoreItems(): Promise<void> {
    try {
      const response = await axios.get('http://localhost:9000', {
        headers: {
          'Content-Type': 'text/xml',
        },
        data: data, // Replace with your dynamic XML request
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

    } catch (error) {
      throw new Error('Failed to fetch items');
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
    try {
      return await this.itemRepository.find();

    } catch (error: any) {
      throw new InternalServerErrorException('Error retrieving FAQs', error.message);
    }
  }

  async findById(id: string): Promise<ItemEntity | null> {
    return this.itemRepository.findOne({ where: { id } }); // Adjust according to your data access layer
  }
  async updateProductImagesAndFiles(
    id: string,
    productImages: Express.Multer.File[], // Multiple product images
    dimensionalFiles: Express.Multer.File[], // Multiple dimensional files (pdf/images)
  ): Promise<any> {
    const item = await this.itemRepository.findOne({ where: { id } });
    if (!item) {
      throw new Error('Item not found');
    }
    const productImageUrls = await this.uploadFilesToFirebase(productImages, 'product-images');
    const dimensionalFileUrls = await this.uploadFilesToFirebase(dimensionalFiles, 'dimensional-files');
    item.productImages = productImageUrls; // Assuming you have productImageUrls column in ItemEntity
    item.dimensionalFiles = dimensionalFileUrls; // Assuming you have dimensionalFileUrls column in ItemEntity

    await this.itemRepository.save(item);
    return { message: 'Item updated successfully with images and files' };
  }

  private async uploadFilesToFirebase(files: Express.Multer.File[], folder: string): Promise<string[]> {
    const uploadPromises = files.map(async (file) => {
      const fileRef = ref(storage, `${folder}/${file.originalname}`);
      const snapshot = await uploadBytes(fileRef, file.buffer);
      return getDownloadURL(snapshot.ref); // Return the file's download URL
    });

    return Promise.all(uploadPromises); // Return an array of URLs after uploading
  }
}