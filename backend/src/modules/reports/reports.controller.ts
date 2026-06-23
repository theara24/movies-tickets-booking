import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { UserRole } from '@prisma/client';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(AuthGuard('jwt'), RbacGuard)
@Roles(UserRole.ADMIN, UserRole.ACCOUNTANT, UserRole.CINEMA_MANAGER)
@ApiBearerAuth()
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard summary' })
  getDashboard() {
    return this.reportsService.getDashboard();
  }

  @Get('daily-sales')
  @ApiOperation({ summary: 'Get daily sales report' })
  @ApiQuery({ name: 'date', required: false })
  getDailySales(@Query('date') date?: string) {
    return this.reportsService.getDailySales(date);
  }

  @Get('monthly-revenue')
  @ApiOperation({ summary: 'Get monthly revenue report' })
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'month', required: false })
  getMonthlyRevenue(
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    return this.reportsService.getMonthlyRevenue(
      year ? parseInt(year, 10) : undefined,
      month ? parseInt(month, 10) : undefined,
    );
  }

  @Get('top-movies')
  @ApiOperation({ summary: 'Get top performing movies' })
  getTopMovies(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reportsService.getTopMovies(
      startDate,
      endDate,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @Get('seat-occupancy')
  @ApiOperation({ summary: 'Get seat occupancy report' })
  getSeatOccupancy(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getSeatOccupancy(startDate, endDate);
  }

  @Get('food-revenue')
  @ApiOperation({ summary: 'Get food and beverage revenue' })
  getFoodRevenue(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getFoodRevenue(startDate, endDate);
  }

  @Get('cancellation-rate')
  @ApiOperation({ summary: 'Get booking cancellation rate' })
  getCancellationRate(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getCancellationRate(startDate, endDate);
  }
}
