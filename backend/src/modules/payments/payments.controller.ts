import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { UserRole } from '@prisma/client';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('process')
  @ApiOperation({ summary: 'Process payment for a booking' })
  processPayment(
    @CurrentUser('id') userId: string,
    @Body() dto: ProcessPaymentDto,
  ) {
    return this.paymentsService.processPayment(userId, dto);
  }

  @Get()
  @UseGuards(RbacGuard)
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTANT, UserRole.CASHIER)
  @ApiOperation({ summary: 'Get all payments' })
  findAll(
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.paymentsService.findAll({
      status,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    });
  }

  @Get('my-payments')
  @ApiOperation({ summary: 'Get current user payments' })
  getMyPayments(
    @CurrentUser('id') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.paymentsService.findAll({
      userId,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    });
  }

  @Get('booking/:bookingId')
  @ApiOperation({ summary: 'Get payment by booking' })
  findByBooking(@Param('bookingId') bookingId: string) {
    return this.paymentsService.findByBooking(bookingId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Post(':id/refund')
  @UseGuards(RbacGuard)
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTANT)
  @ApiOperation({ summary: 'Refund a payment' })
  refundPayment(@Param('id') id: string) {
    return this.paymentsService.refundPayment(id);
  }
}
