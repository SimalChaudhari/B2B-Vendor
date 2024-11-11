// cart.service.ts
import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { CartItemEntity } from './cart.entity';
  import { AddToCartDto, AddToCartItemDto } from './cart.dto';
  import { ItemEntity } from 'fetch-products/item.entity';
  
  @Injectable()
  export class CartService {
    constructor(
      @InjectRepository(CartItemEntity)
      private readonly cartRepository: Repository<CartItemEntity>,
      @InjectRepository(ItemEntity)
      private readonly itemRepository: Repository<ItemEntity>
    ) {}
  
    async addMultipleToCart(userId: string, addToCartDto: AddToCartDto): Promise<CartItemEntity[]> {
        const items: AddToCartItemDto[] = addToCartDto.items || []; // Default to an empty array
    
        if (items.length === 0) {
            throw new HttpException('No items provided to add to the cart', HttpStatus.BAD_REQUEST);
        }
    
        const cartItems: CartItemEntity[] = [];
    
        for (const item of items) {
            const { productId, quantity } = item;
    
            const product = await this.itemRepository.findOne({ where: { id: productId } });
            if (!product) {
                throw new NotFoundException(`Product with ID ${productId} not found`);
            }
    
            let cartItem = await this.cartRepository.findOne({
                where: { product: { id: productId }, userId }
            });
    
            if (cartItem) {
                cartItem.quantity += quantity;
            } else {
                cartItem = this.cartRepository.create({
                    product,
                    quantity,
                    userId
                });
            }
    
            cartItems.push(await this.cartRepository.save(cartItem));
        }
    
        return cartItems;
    }
    
  
    async getCart(userId: string): Promise<CartItemEntity[]> {
      return this.cartRepository.find({ where: { userId }, relations: ['product'] });
    }
  
    async removeFromCart(userId: string, cartItemId: string): Promise<void> {
      const cartItem = await this.cartRepository.findOne({ where: { id: cartItemId, userId } });
  
      if (!cartItem) {
        throw new NotFoundException('Cart item not found');
      }
  
      await this.cartRepository.remove(cartItem);
    }
  
    async clearCart(userId: string): Promise<void> {
      await this.cartRepository.delete({ userId });
    }
  
    async updateCartItemQuantity(
      userId: string,
      cartItemId: string,
      quantityChange: number
    ): Promise<CartItemEntity> {
      const cartItem = await this.cartRepository.findOne({ where: { id: cartItemId, userId } });
  
      if (!cartItem) {
        throw new NotFoundException('Cart item not found');
      }
  
      cartItem.quantity += quantityChange;
  
      if (cartItem.quantity < 100) {
        throw new HttpException('Quantity cannot be less than 100', HttpStatus.BAD_REQUEST);
      }
  
      return this.cartRepository.save(cartItem);
    }
  }
  