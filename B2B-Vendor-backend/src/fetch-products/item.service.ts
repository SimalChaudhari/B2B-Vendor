// product.service.ts
import { Injectable } from '@nestjs/common';
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
      const existingItems = await this. itemRepository.find();

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
      itemDto.itemName = item.ITEMNAME[0] || "Default Name";
      itemDto.alias = item.ALIAS?.[0];
      itemDto.partNo = item.PARTNO?.[0];
      itemDto.description = item.DESCRIPTION?.[0];
      itemDto.remarks = item.REMARKS?.[0];
      itemDto.group = item?.GROUP[0];
      itemDto.category = item.CATEGORY[0];
      itemDto.baseUnit = item?.BASEUNIT[0];
      itemDto.alternateUnit = item.ALTERNATEUNIT?.[0];
      itemDto.isBatchWiseOn = item?.ISBATCHWISEON[0];
      itemDto.hasMfgDate = item.HASMFGDATE?.[0];
      itemDto.hasExpiryDate = item.HASEXPIRYDATE?.[0];
      itemDto.costPriceDate = item.COSTPRICEDATE?.[0];
      itemDto.costPrice = item.COSTPRICE?.[0];
      itemDto.sellingPriceDate = item.SELLINGPRICEDATE?.[0];
      itemDto.sellingPrice = item.SELLINGPRICE?.[0];
      itemDto.gstApplicable = item.GSTAPPLICABLE?.[0];
      itemDto.gstApplicableDate = item.GSTAPPLICABLEDATE?.[0];
      itemDto.gstRate = item.GSTRATE?.[0];
      itemDto.mrpDate = item.MRPDATE?.[0];
      itemDto.mrpRate = item.MRPRATE?.[0];

      // Convert DTO to Entity
      return this.itemRepository.create(itemDto);
    });
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
}
