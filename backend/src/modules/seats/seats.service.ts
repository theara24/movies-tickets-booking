import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UpdateSeatDto } from './dto/update-seat.dto';

@Injectable()
export class SeatsService {
  constructor(private prisma: PrismaService) {}

  async findByHall(hallId: string) {
    return this.prisma.seat.findMany({
      where: { hallId },
      orderBy: [{ row: 'asc' }, { column: 'asc' }],
    });
  }

  async findOne(id: string) {
    const seat = await this.prisma.seat.findUnique({
      where: { id },
      include: { hall: { include: { cinema: true } } },
    });
    if (!seat) throw new NotFoundException('Seat not found');
    return seat;
  }

  async update(id: string, dto: UpdateSeatDto) {
    const seat = await this.prisma.seat.findUnique({ where: { id } });
    if (!seat) throw new NotFoundException('Seat not found');

    return this.prisma.seat.update({ where: { id }, data: dto });
  }

  async getAvailableSeats(showtimeId: string) {
    const showtime = await this.prisma.showtime.findUnique({
      where: { id: showtimeId },
      include: { hall: { include: { seats: true } } },
    });
    if (!showtime) throw new NotFoundException('Showtime not found');

    const bookedSeatIds = (
      await this.prisma.bookingSeat.findMany({
        where: {
          booking: { showtimeId, status: { in: ['PENDING', 'CONFIRMED'] } },
        },
        select: { seatId: true },
      })
    ).map((bs) => bs.seatId);

    const lockedSeatIds = (
      await this.prisma.seatLock.findMany({
        where: {
          showtimeId,
          isActive: true,
          expiresAt: { gt: new Date() },
        },
        select: { seatId: true },
      })
    ).map((sl) => sl.seatId);

    const unavailableIds = new Set([...bookedSeatIds, ...lockedSeatIds]);

    return showtime.hall.seats.map((seat) => ({
      ...seat,
      isAvailable:
        !unavailableIds.has(seat.id) &&
        seat.isActive &&
        seat.status === 'AVAILABLE',
    }));
  }
}
