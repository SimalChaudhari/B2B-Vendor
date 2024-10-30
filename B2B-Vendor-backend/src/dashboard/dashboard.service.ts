// dashboard.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ItemService } from 'fetch-products/item.service';
import { OrderService } from 'order/order.service';
import { UserService } from 'users/user/users.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly itemService: ItemService,
    private readonly userService: UserService,
    private readonly orderService: OrderService,
  ) { }

  async getDashboardData() {
    try {
      const [items, users, orders] = await Promise.all([
        this.itemService.findAll(),
        this.userService.findAllVendors(),
        this.orderService.findAllCompleted(),
      ]);

      return {
        itemsCount: items.length,
        usersCount: users.length,
        ordersCount: orders.length,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch dashboard data');
    }
  }
}