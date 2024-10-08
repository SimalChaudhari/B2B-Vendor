// product.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { parseStringPromise } from 'xml2js'; // Library for parsing XML to JSON
import { ItemEntity } from './item.entity';
import { ItemDto } from './item.dto';

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
      itemDto.itemName = this.cleanString(item.ITEMNAME[0] || "Default Name");
      itemDto.alias = this.cleanString(item.ALIAS?.[0]);
      itemDto.partNo = this.cleanString(item.PARTNO?.[0]);
      itemDto.description = this.cleanString(item.DESCRIPTION?.[0]);
      itemDto.remarks = this.cleanString(item.REMARKS?.[0]);
      itemDto.group = this.cleanString(item?.GROUP[0]);
      itemDto.category = this.cleanString(item.CATEGORY[0]);
      itemDto.baseUnit = this.cleanString(item?.BASEUNIT[0]);
      itemDto.alternateUnit = this.cleanString(item.ALTERNATEUNIT?.[0]);
      itemDto.isBatchWiseOn = this.cleanString(item?.ISBATCHWISEON[0]);
      itemDto.hasMfgDate = this.cleanString(item.HASMFGDATE?.[0]);
      itemDto.hasExpiryDate = this.cleanString(item.HASEXPIRYDATE?.[0]);
      itemDto.costPriceDate = this.cleanString(item.COSTPRICEDATE?.[0]);
      itemDto.costPrice = this.cleanString(item.COSTPRICE?.[0]);
      itemDto.sellingPriceDate = this.cleanString(item.SELLINGPRICEDATE?.[0]);
      itemDto.sellingPrice = this.cleanString(item.SELLINGPRICE?.[0]);
      itemDto.gstApplicable = this.cleanString(item.GSTAPPLICABLE?.[0]);
      itemDto.gstApplicableDate = this.cleanString(item.GSTAPPLICABLEDATE?.[0]);
      itemDto.gstRate = this.cleanString(item.GSTRATE?.[0]);
      itemDto.mrpDate = this.cleanString(item.MRPDATE?.[0]);
      itemDto.mrpRate = this.cleanString(item.MRPRATE?.[0]);
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
      existingProduct.description !== newItem.description ||
      existingProduct.remarks !== newItem.remarks ||
      existingProduct.group !== newItem.group ||
      existingProduct.category !== newItem.category ||
      existingProduct.baseUnit !== newItem.baseUnit ||
      existingProduct.alternateUnit !== newItem.alternateUnit ||
      existingProduct.isBatchWiseOn !== newItem.isBatchWiseOn ||
      existingProduct.hasMfgDate !== newItem.hasMfgDate ||
      existingProduct.hasExpiryDate !== newItem.hasExpiryDate ||
      existingProduct.costPriceDate !== newItem.costPriceDate ||
      existingProduct.costPrice !== newItem.costPrice ||
      existingProduct.sellingPriceDate !== newItem.sellingPriceDate ||
      existingProduct.sellingPrice !== newItem.sellingPrice ||
      existingProduct.gstApplicable !== newItem.gstApplicable ||
      existingProduct.gstApplicableDate !== newItem.gstApplicableDate ||
      existingProduct.gstRate !== newItem.gstRate ||
      existingProduct.mrpDate !== newItem.mrpDate ||
      existingProduct.mrpRate !== newItem.mrpRate
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



}
