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
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Promotions')
@Controller('promotions')
export class PromotionsController {
  constructor(private promotionsService: PromotionsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.ADMIN, UserRole.CINEMA_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a promotion' })
  create(@Body() dto: CreatePromotionDto) {
    return this.promotionsService.create(dto);
  }

  @Public()
  @Get('validate/:code')
  @ApiOperation({ summary: 'Validate a promotion code' })
  validateCode(@Param('code') code: string, @Query('amount') amount: string) {
    return this.promotionsService.validateCode(code, parseFloat(amount));
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all promotions' })
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.promotionsService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get promotion by ID' })
  findOne(@Param('id') id: string) {
    return this.promotionsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.ADMIN, UserRole.CINEMA_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a promotion' })
  update(@Param('id') id: string, @Body() dto: UpdatePromotionDto) {
    return this.promotionsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a promotion' })
  remove(@Param('id') id: string) {
    return this.promotionsService.remove(id);
  }
}
