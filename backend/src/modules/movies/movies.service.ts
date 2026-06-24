import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieQueryDto } from './dto/movie-query.dto';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMovieDto) {
    const { genreIds, ...movieData } = dto;

    const movie = await this.prisma.movie.create({
      data: {
        ...movieData,
        releaseDate: new Date(dto.releaseDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        genres: genreIds?.length
          ? {
              create: genreIds.map((genreId) => ({ genreId })),
            }
          : undefined,
      },
      include: {
        genres: { include: { genre: true } },
      },
    });

    return movie;
  }

  async findAll(query: MovieQueryDto, page = 1, limit = 10) {
    const resolvedLimit = query.limit ?? limit;
    const resolvedPage = query.page ?? page;
    const skip = (resolvedPage - 1) * resolvedLimit;
    const where: any = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.status) where.status = query.status;
    if (query.language) where.language = query.language;
    if (query.genreId) {
      where.genres = { some: { genreId: query.genreId } };
    }

    const [data, total] = await Promise.all([
      this.prisma.movie.findMany({
        where,
        skip,
        take: resolvedLimit,
        include: {
          genres: { include: { genre: true } },
        },
        orderBy: { releaseDate: 'desc' },
      }),
      this.prisma.movie.count({ where }),
    ]);

    return {
      data,
      pagination: { page: resolvedPage, limit: resolvedLimit, total, totalPages: Math.ceil(total / resolvedLimit) },
    };
  }

  async findOne(id: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: {
        genres: { include: { genre: true } },
        showtimes: {
          where: { isActive: true, startTime: { gte: new Date() } },
          include: { cinema: true, hall: true },
          orderBy: { startTime: 'asc' },
          take: 10,
        },
      },
    });

    if (!movie) throw new NotFoundException('Movie not found');
    return movie;
  }

  async update(id: string, dto: UpdateMovieDto) {
    const movie = await this.prisma.movie.findUnique({ where: { id } });
    if (!movie) throw new NotFoundException('Movie not found');

    const { genreIds, ...movieData } = dto;

    if (genreIds) {
      await this.prisma.movieGenre.deleteMany({ where: { movieId: id } });
      await this.prisma.movieGenre.createMany({
        data: genreIds.map((genreId) => ({ movieId: id, genreId })),
      });
    }

    return this.prisma.movie.update({
      where: { id },
      data: {
        ...movieData,
        releaseDate: dto.releaseDate ? new Date(dto.releaseDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
      include: { genres: { include: { genre: true } } },
    });
  }

  async remove(id: string) {
    const movie = await this.prisma.movie.findUnique({ where: { id } });
    if (!movie) throw new NotFoundException('Movie not found');

    await this.prisma.movie.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });

    return { message: 'Movie archived successfully' };
  }

  async getNowShowing(page = 1, limit = 20) {
    const now = new Date();
    return this.findAll({ status: 'NOW_SHOWING' }, page, limit);
  }

  async getComingSoon(page = 1, limit = 20) {
    return this.findAll({ status: 'COMING_SOON' }, page, limit);
  }
}
