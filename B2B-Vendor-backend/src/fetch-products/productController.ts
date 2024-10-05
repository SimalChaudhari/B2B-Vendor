// product.controller.ts
import { Controller, Post } from '@nestjs/common';
import { ProductService } from './product.service';


@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('/fetch')
  async fetchProducts() {
    await this.productService.fetchAndStoreProducts();
    return { message: 'Products fetched and stored successfully' };
  }
}
