import { Controller, Get, Param, Patch, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SeatsService } from './seats.service';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Seats')
@Controller('seats')
export class SeatsController {
  constructor(private seatsService: SeatsService) {}

  @Public()
  @Get('hall/:hallId')
  @ApiOperation({ summary: 'Get seats by hall' })
  findByHall(@Param('hallId') hallId: string) {
    return this.seatsService.findByHall(hallId);
  }

  @Public()
  @Get('available/:showtimeId')
  @ApiOperation({ summary: 'Get available seats for a showtime' })
  getAvailableSeats(@Param('showtimeId') showtimeId: string) {
    return this.seatsService.getAvailableSeats(showtimeId);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get seat by ID' })
  findOne(@Param('id') id: string) {
    return this.seatsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.ADMIN, UserRole.CINEMA_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update seat' })
  update(@Param('id') id: string, @Body() dto: UpdateSeatDto) {
    return this.seatsService.update(id, dto);
  }
}
