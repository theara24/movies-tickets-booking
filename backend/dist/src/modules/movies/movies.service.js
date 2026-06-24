"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoviesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let MoviesService = class MoviesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
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
    async findAll(query, page = 1, limit = 10) {
        const resolvedLimit = query.limit ?? limit;
        const resolvedPage = query.page ?? page;
        const skip = (resolvedPage - 1) * resolvedLimit;
        const where = {};
        if (query.search) {
            where.OR = [
                { title: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        if (query.status)
            where.status = query.status;
        if (query.language)
            where.language = query.language;
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
    async findOne(id) {
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
        if (!movie)
            throw new common_1.NotFoundException('Movie not found');
        return movie;
    }
    async update(id, dto) {
        const movie = await this.prisma.movie.findUnique({ where: { id } });
        if (!movie)
            throw new common_1.NotFoundException('Movie not found');
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
    async remove(id) {
        const movie = await this.prisma.movie.findUnique({ where: { id } });
        if (!movie)
            throw new common_1.NotFoundException('Movie not found');
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
};
exports.MoviesService = MoviesService;
exports.MoviesService = MoviesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MoviesService);
//# sourceMappingURL=movies.service.js.map