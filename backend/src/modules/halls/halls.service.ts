import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';
import { CreateSeatDto } from './dto/create-seats.dto';
import { SeatType } from '@prisma/client';

@Injectable()
export class HallsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateHallDto) {
    const capacity = dto.capacity || dto.rows * dto.columns;
    
    const hall = await this.prisma.hall.create({
      data: {
        name: dto.name,
        cinemaId: dto.cinemaId,
        rows: dto.rows,
        columns: dto.columns,
        capacity,
      },
    });

    const seats: Array<{
      hallId: string;
      row: string;
      column: string;
      number: number;
      type: SeatType;
    }> = [];
    const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < dto.rows; r++) {
      for (let c = 0; c < dto.columns; c++) {
        seats.push({
          hallId: hall.id,
          row: rowLabels[r],
          column: String(c + 1),
          number: r * dto.columns + c + 1,
          type: SeatType.STANDARD,
        });
      }
    }

    await this.prisma.seat.createMany({ data: seats });

    return this.prisma.hall.findUnique({
      where: { id: hall.id },
      include: { seats: { orderBy: { number: 'asc' } } },
    });
  }

  async findAll(cinemaId?: string) {
    const where = cinemaId ? { cinemaId } : {};
    return this.prisma.hall.findMany({
      where,
      include: { _count: { select: { seats: true, showtimes: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const hall = await this.prisma.hall.findUnique({
      where: { id },
      include: {
        seats: {
          orderBy: [{ row: 'asc' }, { column: 'asc' }],
        },
        cinema: true,
      },
    });
    if (!hall) throw new NotFoundException('Hall not found');
    return hall;
  }

  async update(id: string, dto: UpdateHallDto) {
    const hall = await this.prisma.hall.findUnique({ where: { id } });
    if (!hall) throw new NotFoundException('Hall not found');

    return this.prisma.hall.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const hall = await this.prisma.hall.findUnique({ where: { id } });
    if (!hall) throw new NotFoundException('Hall not found');

    await this.prisma.hall.update({ where: { id }, data: { isActive: false } });
    return { message: 'Hall deactivated successfully' };
  }

  async bulkCreateSeats(seats: CreateSeatDto[]) {
    const hallId = seats[0]?.hallId;
    const hall = await this.prisma.hall.findUnique({ where: { id: hallId } });
    if (!hall) throw new NotFoundException('Hall not found');

    await this.prisma.seat.createMany({
      data: seats,
      skipDuplicates: true,
    });

    return this.prisma.seat.findMany({ where: { hallId }, orderBy: { number: 'asc' } });
  }
}
