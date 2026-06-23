import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FoodService } from './food.service';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { UpdateFoodItemDto } from './dto/update-food-item.dto';
import { CreateFoodOrderDto } from './dto/create-food-order.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Food & Beverage')
@Controller('food')
export class FoodController {
  constructor(private foodService: FoodService) {}

  @Post('items')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.ADMIN, UserRole.CINEMA_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a food item' })
  createItem(@Body() dto: CreateFoodItemDto) {
    return this.foodService.createItem(dto);
  }

  @Public()
  @Get('items')
  @ApiOperation({ summary: 'Get all food items' })
  findAllItems(@Query('category') category?: string) {
    return this.foodService.findAllItems(category);
  }

  @Public()
  @Get('items/:id')
  @ApiOperation({ summary: 'Get food item by ID' })
  findOneItem(@Param('id') id: string) {
    return this.foodService.findOneItem(id);
  }

  @Patch('items/:id')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.ADMIN, UserRole.CINEMA_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a food item' })
  updateItem(@Param('id') id: string, @Body() dto: UpdateFoodItemDto) {
    return this.foodService.updateItem(id, dto);
  }

  @Delete('items/:id')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate a food item' })
  removeItem(@Param('id') id: string) {
    return this.foodService.removeItem(id);
  }

  @Post('orders')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a food order' })
  createOrder(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateFoodOrderDto,
  ) {
    return this.foodService.createOrder(userId, dto);
  }

  @Get('orders')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.ADMIN, UserRole.CINEMA_MANAGER, UserRole.CASHIER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all food orders' })
  findAllOrders(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.foodService.findAllOrders(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get('orders/my-orders')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my food orders' })
  getMyOrders(@CurrentUser('id') userId: string) {
    return this.foodService.findOrdersByUser(userId);
  }

  @Get('orders/booking/:bookingId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get food order by booking' })
  findOrdersByBooking(@Param('bookingId') bookingId: string) {
    return this.foodService.findOrdersByBooking(bookingId);
  }
}
