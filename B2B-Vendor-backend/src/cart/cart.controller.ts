// cart.controller.ts
import { Controller, Post, Body, Get, Delete, Param, Req, UseGuards, Res, Patch } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './cart.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'auth/jwt/jwt-auth.guard';

@UseGuards(JwtAuthGuard) // Protect all routes in this controller
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

      // Increment cart item quantity
      @Patch('/increment/:cartItemId')
      async incrementQuantity(
          @Req() req: Request,
          @Param('cartItemId') cartItemId: string
      ) {
          const userId = req.user.id;
          return this.cartService.updateCartItemQuantity(userId, cartItemId, 1); // Increment by 1
      }
  
      // Decrement cart item quantity
      @Patch('/decrement/:cartItemId')
      async decrementQuantity(
          @Req() req: Request,
          @Param('cartItemId') cartItemId: string
      ) {
          const userId = req.user.id;
          return this.cartService.updateCartItemQuantity(userId, cartItemId, -1); // Decrement by 1
      }

    @Post('/add')
    async addToCart(
        @Req() request: Request,
        @Body() addToCartDto: AddToCartDto) {
        const userId = request.user.id; // Assume user is authenticated and user ID is available

        return this.cartService.addToCart(userId, addToCartDto);
    }

    @Get()
    async getCart(@Req() req: Request) {
        const userId = req.user.id;
        return this.cartService.getCart(userId);
    }

    @Delete('/delete/:cartItemId')
    async removeFromCart(@Req() req: Request,
        @Res() res: Response,
        @Param('cartItemId') cartItemId: string) {
        const userId = req.user.id;
        await this.cartService.removeFromCart(userId, cartItemId);
        return res.status(200).json({ message: 'Cart item removed successfully' });

    }

    @Delete('/clear')
    async clearCart(@Req() req: Request, @Res() res: Response) {
        const userId = req.user.id;
        await this.cartService.clearCart(userId);
        return res.status(200).json({ message: 'Cart cleared successfully' });
    }
}
