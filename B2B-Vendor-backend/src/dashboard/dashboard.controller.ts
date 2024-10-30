// dashboard.controller.ts
import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('data')
  async getDashboardData() {
    try {
      return await this.dashboardService.getDashboardData();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch dashboard data');
    }
  }
}
