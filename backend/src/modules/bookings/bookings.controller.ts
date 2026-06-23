import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingQueryDto } from './dto/booking-query.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { UserRole } from '@prisma/client';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(
    @Query() query: BookingQueryDto,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.bookingsService.findAll(
      query,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @Get('my-bookings')
  @ApiOperation({ summary: 'Get current user bookings' })
  getMyBookings(
    @CurrentUser('id') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.bookingsService.findByUser(
      userId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get booking summary for current user' })
  getSummary(@CurrentUser('id') userId: string) {
    return this.bookingsService.getBookingSummary(userId);
  }

  @Get('ref/:ref')
  @ApiOperation({ summary: 'Find booking by reference' })
  findByReference(@Param('ref') ref: string) {
    return this.bookingsService.findByReference(ref);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel booking' })
  cancel(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.bookingsService.cancelBooking(id, userId);
  }
}
