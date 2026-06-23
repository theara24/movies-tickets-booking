import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateGenreDto) {
    const existing = await this.prisma.genre.findFirst({
      where: { OR: [{ name: dto.name }, { slug: dto.slug }] },
    });
    if (existing) throw new ConflictException('Genre name or slug already exists');

    return this.prisma.genre.create({ data: dto });
  }

  async findAll() {
    return this.prisma.genre.findMany({
      include: { _count: { select: { movies: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      include: { movies: { include: { movie: true } } },
    });
    if (!genre) throw new NotFoundException('Genre not found');
    return genre;
  }

  async update(id: string, dto: UpdateGenreDto) {
    const genre = await this.prisma.genre.findUnique({ where: { id } });
    if (!genre) throw new NotFoundException('Genre not found');

    return this.prisma.genre.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const genre = await this.prisma.genre.findUnique({ where: { id } });
    if (!genre) throw new NotFoundException('Genre not found');

    await this.prisma.genre.delete({ where: { id } });
    return { message: 'Genre deleted successfully' };
  }
}
