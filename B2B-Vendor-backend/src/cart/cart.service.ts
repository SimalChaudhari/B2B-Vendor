// cart.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItemEntity } from './cart.entity';
import { AddToCartDto } from './cart.dto';
import { ItemEntity } from 'fetch-products/item.entity';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(CartItemEntity)
        private readonly cartRepository: Repository<CartItemEntity>,
        @InjectRepository(ItemEntity)
        private readonly itemRepository: Repository<ItemEntity>,
    ) { }

    async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<CartItemEntity> {
        const { productId, quantity } = addToCartDto;

        const product = await this.itemRepository.findOne({ where: { id: productId } });
        if (!product) {
            throw new NotFoundException(`Product with ID  not found`);
        }

        // Check if product is already in cart
        let cartItem = await this.cartRepository.findOne({ where: { product: { id: productId }, userId } });

        if (cartItem) {
            // If already in cart, update quantity
            cartItem.quantity += quantity;
        } else {
            // If not, create a new cart item
            cartItem = this.cartRepository.create({
                product,
                quantity,
                userId,
            });
        }

        return this.cartRepository.save(cartItem);
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
}
