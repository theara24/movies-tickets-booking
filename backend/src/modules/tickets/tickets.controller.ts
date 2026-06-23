import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my tickets' })
  getMyTickets(
    @CurrentUser('id') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.ticketsService.findByUser(
      userId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Public()
  @Get('validate/:ticketRef')
  @ApiOperation({ summary: 'Validate a ticket' })
  validateTicket(@Param('ticketRef') ticketRef: string) {
    return this.ticketsService.validateTicket(ticketRef);
  }

  @Post('scan/:ticketRef')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.GATE_STAFF, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Scan a ticket (mark as used)' })
  scanTicket(
    @Param('ticketRef') ticketRef: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.ticketsService.scanTicket(ticketRef, userId);
  }

  @Get('booking/:bookingId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get ticket by booking' })
  getTicketByBooking(@Param('bookingId') bookingId: string) {
    return this.ticketsService.getTicketByBooking(bookingId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get ticket by ID' })
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(id);
  }

  @Get('ref/:ticketRef')
  @Public()
  @ApiOperation({ summary: 'Get ticket by reference' })
  findByReference(@Param('ticketRef') ticketRef: string) {
    return this.ticketsService.findByReference(ticketRef);
  }
}
