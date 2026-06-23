import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';

@Injectable()
export class ShowtimesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateShowtimeDto) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: dto.movieId },
    });
    if (!movie) throw new NotFoundException('Movie not found');

    const hall = await this.prisma.hall.findUnique({
      where: { id: dto.hallId },
    });
    if (!hall) throw new NotFoundException('Hall not found');

    const startTime = new Date(dto.startTime);
    const endTime = new Date(startTime.getTime() + movie.duration * 60000);
    const bufferMinutes = dto.bufferMinutes || 15;

    const conflictingShowtime = await this.prisma.showtime.findFirst({
      where: {
        hallId: dto.hallId,
        isActive: true,
        status: { notIn: ['CANCELLED', 'FINISHED'] },
        OR: [
          {
            startTime: { lt: endTime },
            endTime: { gt: startTime },
          },
          {
            startTime: { gte: startTime, lt: endTime },
          },
        ],
      },
    });

    if (conflictingShowtime) {
      throw new ConflictException(
        `Hall is already occupied from ${conflictingShowtime.startTime.toISOString()} to ${conflictingShowtime.endTime.toISOString()}`,
      );
    }

    const showtime = await this.prisma.showtime.create({
      data: {
        movieId: dto.movieId,
        cinemaId: dto.cinemaId,
        hallId: dto.hallId,
        startTime,
        endTime,
        bufferMinutes,
        price: dto.price,
      },
      include: {
        movie: { select: { title: true, duration: true } },
        hall: { select: { name: true } },
        cinema: { select: { name: true } },
      },
    });

    return showtime;
  }

  async findAll(query: {
    movieId?: string;
    cinemaId?: string;
    date?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    if (query.movieId) where.movieId = query.movieId;
    if (query.cinemaId) where.cinemaId = query.cinemaId;
    if (query.status) where.status = query.status;
    if (query.date) {
      const date = new Date(query.date);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      where.startTime = { gte: date, lt: nextDay };
    } else {
      where.startTime = { gte: new Date() };
    }

    const [data, total] = await Promise.all([
      this.prisma.showtime.findMany({
        where,
        skip,
        take: limit,
        include: {
          movie: {
            select: {
              id: true,
              title: true,
              duration: true,
              posterUrl: true,
              rating: true,
              language: true,
            },
          },
          hall: { select: { id: true, name: true, capacity: true } },
          cinema: { select: { id: true, name: true, city: true } },
          _count: { select: { bookings: true } },
        },
        orderBy: { startTime: 'asc' },
      }),
      this.prisma.showtime.count({ where }),
    ]);

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const showtime = await this.prisma.showtime.findUnique({
      where: { id },
      include: {
        movie: true,
        hall: {
          include: { seats: { orderBy: [{ row: 'asc' }, { column: 'asc' }] } },
        },
        cinema: true,
      },
    });
    if (!showtime) throw new NotFoundException('Showtime not found');
    return showtime;
  }

  async update(id: string, dto: UpdateShowtimeDto) {
    const showtime = await this.prisma.showtime.findUnique({ where: { id } });
    if (!showtime) throw new NotFoundException('Showtime not found');

    const data: any = {};
    if (dto.startTime) data.startTime = new Date(dto.startTime);
    if (dto.price !== undefined) data.price = dto.price;
    if (dto.bufferMinutes) data.bufferMinutes = dto.bufferMinutes;
    if (dto.movieId) data.movieId = dto.movieId;
    if (dto.hallId) data.hallId = dto.hallId;
    if (dto.cinemaId) data.cinemaId = dto.cinemaId;

    return this.prisma.showtime.update({
      where: { id },
      data,
      include: { movie: true, hall: true, cinema: true },
    });
  }

  async remove(id: string) {
    const showtime = await this.prisma.showtime.findUnique({ where: { id } });
    if (!showtime) throw new NotFoundException('Showtime not found');

    await this.prisma.showtime.update({
      where: { id },
      data: { isActive: false, status: 'CANCELLED' },
    });

    await this.prisma.seatLock.updateMany({
      where: { showtimeId: id, isActive: true },
      data: { isActive: false },
    });

    return { message: 'Showtime cancelled successfully' };
  }

  async getShowtimesByDate(date: string, cinemaId?: string) {
    return this.findAll({ date, cinemaId, limit: 100 });
  }

  async getShowtimesByMovie(movieId: string, cinemaId?: string, date?: string) {
    return this.findAll({ movieId, cinemaId, date, limit: 50 });
  }
}
