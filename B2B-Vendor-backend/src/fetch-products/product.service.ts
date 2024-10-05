// product.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { parseStringPromise } from 'xml2js'; // Library for parsing XML to JSON
import { ProductEntity } from './product.entity';
import { ProductDto } from './products.dto';

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
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) { }

  async fetchAndStoreProducts(): Promise<void> {
    try {
      const response = await axios.get('http://localhost:9000', {
        headers: {
          'Content-Type': 'text/xml',
        },
        data: data, // Replace with your dynamic XML request
      });

      const products = await this.parseXmlToProducts(response.data);

      const productData = [
        {
          itemName: 'Tiles',
          alias: '',
          partNo: '',
          description: '',
          remarks: '',
          group: '\x04 Primary',
          category: '\x04 Not Applicable',
          baseUnit: 'SqFt',
          alternateUnit: '\x04 Not Applicable',
          isBatchWiseOn: 'No',
          hasMfgDate: 'No',
          hasExpiryDate: 'No',
          costPriceDate: '',
          costPrice: '',
          sellingPriceDate: '',
          sellingPrice: '',
          gstApplicable: '\x04 Applicable',
          gstApplicableDate: '1-Apr-24',
          gstRate: '0',
          mrpDate: '',
          mrpRate: ''
        }

      ]

      // Save products to the database
      for (const product of productData) {
        try {
          await this.productRepository.save(product);
        } catch (error: any) {
          console.error('Error saving product:', error.message);
          console.error('Product data:', product);
        }
      }

    } catch (error) {
      // console.error('Failed to fetch or save products', error);
      // throw new Error('Failed to fetch products');
    }
  }

  async parseXmlToProducts(xml: string): Promise<ProductEntity[]> {
    const parsedResult = await parseStringPromise(xml);
    const stockItems = parsedResult.ENVELOPE.STOCKITEM || [];

    return stockItems.map((item: any) => {
      const productDto = new ProductDto();
      productDto.itemName = item.ITEMNAME[0] || "Default Name";;
      productDto.alias = item.ALIAS?.[0];
      productDto.partNo = item.PARTNO?.[0];
      productDto.description = item.DESCRIPTION?.[0];
      productDto.remarks = item.REMARKS?.[0];
      productDto.group = item?.GROUP[0];
      productDto.category = item.CATEGORY[0];
      productDto.baseUnit = item?.BASEUNIT[0];
      productDto.alternateUnit = item.ALTERNATEUNIT?.[0];
      productDto.isBatchWiseOn = item?.ISBATCHWISEON[0];
      productDto.hasMfgDate = item.HASMFGDATE?.[0];
      productDto.hasExpiryDate = item.HASEXPIRYDATE?.[0];
      productDto.costPriceDate = item.COSTPRICEDATE?.[0];
      productDto.costPrice = item.COSTPRICE?.[0];
      productDto.sellingPriceDate = item.SELLINGPRICEDATE?.[0];
      productDto.sellingPrice = item.SELLINGPRICE?.[0];
      productDto.gstApplicable = item.GSTAPPLICABLE?.[0];
      productDto.gstApplicableDate = item.GSTAPPLICABLEDATE?.[0];
      productDto.gstRate = item.GSTRATE?.[0];
      productDto.mrpDate = item.MRPDATE?.[0];
      productDto.mrpRate = item.MRPRATE?.[0];

      // Convert DTO to Entity
      return this.productRepository.create(productDto);
    });
  }
}