import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';

@Injectable()
export class CinemasService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCinemaDto) {
    return this.prisma.cinema.create({ data: dto });
  }

  async findAll() {
    return this.prisma.cinema.findMany({
      include: { _count: { select: { halls: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const cinema = await this.prisma.cinema.findUnique({
      where: { id },
      include: {
        halls: {
          include: { _count: { select: { seats: true, showtimes: true } } },
        },
        staff: {
          select: {
            id: true,
            user: { select: { fullName: true, email: true } },
          },
        },
      },
    });
    if (!cinema) throw new NotFoundException('Cinema not found');
    return cinema;
  }

  async update(id: string, dto: UpdateCinemaDto) {
    const cinema = await this.prisma.cinema.findUnique({ where: { id } });
    if (!cinema) throw new NotFoundException('Cinema not found');

    return this.prisma.cinema.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const cinema = await this.prisma.cinema.findUnique({ where: { id } });
    if (!cinema) throw new NotFoundException('Cinema not found');

    await this.prisma.cinema.update({
      where: { id },
      data: { isActive: false },
    });
    return { message: 'Cinema deactivated successfully' };
  }
}
