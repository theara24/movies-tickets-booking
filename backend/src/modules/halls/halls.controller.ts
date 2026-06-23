import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HallsService } from './halls.service';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';
import { CreateSeatDto } from './dto/create-seats.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Halls')
@Controller('halls')
export class HallsController {
  constructor(private hallsService: HallsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.ADMIN, UserRole.CINEMA_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a hall with auto-generated seats' })
  create(@Body() dto: CreateHallDto) {
    return this.hallsService.create(dto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all halls' })
  findAll(@Query('cinemaId') cinemaId?: string) {
    return this.hallsService.findAll(cinemaId);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get hall by ID with seats' })
  findOne(@Param('id') id: string) {
    return this.hallsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.ADMIN, UserRole.CINEMA_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update hall' })
  update(@Param('id') id: string, @Body() dto: UpdateHallDto) {
    return this.hallsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate hall' })
  remove(@Param('id') id: string) {
    return this.hallsService.remove(id);
  }

  @Post('seats/bulk')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.ADMIN, UserRole.CINEMA_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk create seats' })
  bulkCreateSeats(@Body() seats: CreateSeatDto[]) {
    return this.hallsService.bulkCreateSeats(seats);
  }
}
